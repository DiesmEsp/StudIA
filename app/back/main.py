import os
import re
import json
import sqlite3
import networkx as nx

import matplotlib
matplotlib.use('Agg')  # 👈 evita errores de GUI en servidores

import matplotlib.pyplot as plt
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# === Configuración inicial ===
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-preview-05-20",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    google_api_key=api_key
)

app = Flask(__name__)
CORS(app)  # o config específico si deseas restringir origen

# === Función para exportar cursos desde SQLite ===
def exportar_cursos_desde_sqlite(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, codigo, titulo, descripcion, nivel
        FROM cursos
        ORDER BY id
    """)
    cursos = cursor.fetchall()

    resultado = []
    for curso in cursos:
        curso_id, codigo, titulo, descripcion, nivel = curso
        cursor.execute("SELECT tema FROM curso_temas WHERE curso_id = ?", (curso_id,))
        temas = [row[0] for row in cursor.fetchall()]
        resultado.append({
            "id": codigo,
            "titulo": titulo,
            "descripcion": descripcion,
            "temas": temas,
            "nivel": nivel
        })

    conn.close()
    return resultado

# === Función para construir el prompt ===
def construir_prompt(cursos, tema_usuario, nivel):
    prompt = f"""
Eres un planificador experto en rutas de aprendizaje.

Con la lista de cursos que te doy a continuación, construye un roadmap de aprendizaje.

Tu objetivo es seleccionar los cursos más relevantes que contribuyan al dominio del tema, considerando temas, nivel de dificultad y prerequisitos.
"""
    if nivel == "minimalista":
        prompt += """
Selecciona solo los cursos estrictamente necesarios para comprender y dominar el tema principal, sin incluir cursos complementarios ni tecnologías adyacentes.
"""
    elif nivel == "detallado":
        prompt += """
Además de los cursos directamente relacionados con el tema, puedes incluir algunos cursos complementarios que aporten fundamentos técnicos o habilidades transversales útiles en contextos reales.

Evita incluir cursos centrados en tecnologías no esenciales al tema principal.
"""

    prompt += f"""

Devuélveme exclusivamente una lista de aristas (duplas) en este formato:

[["curso_prerrequisito_id", "curso_dependiente_id"], ...]

Cada dupla indica que el primer curso debe ser completado antes que el segundo. Ordena el camino desde los más básicos hasta los más avanzados.

NO incluyas explicaciones ni textos adicionales, solo la lista JSON con las duplas.

Aquí está la lista de cursos:
{json.dumps(cursos, ensure_ascii=False)}
"""
    return prompt.strip()

# === Función para guardar logs en segundo plano ===
def guardar_logs(contenido, duplas, prompt, cursos, nivel, tema):
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        LOGS_DIR = os.path.join(BASE_DIR, "logs")
        os.makedirs(LOGS_DIR, exist_ok=True)

        RAW_RESPONSE_PATH = os.path.join(LOGS_DIR, "raw_response.txt")
        LAST_PROMPT_PATH = os.path.join(LOGS_DIR, "last_prompt.txt")
        LAST_OUTPUT_PATH = os.path.join(LOGS_DIR, "last_output.json")
        LAST_GRAPH_PATH = os.path.join(LOGS_DIR, "last_graph.png")

        with open(RAW_RESPONSE_PATH, "w", encoding="utf-8") as f:
            f.write(contenido)

        with open(LAST_PROMPT_PATH, "w", encoding="utf-8") as f:
            f.write(prompt)

        with open(LAST_OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(duplas, f, indent=2, ensure_ascii=False)

        # Grafo
        ids_usados = {origen for origen, destino in duplas} | {destino for origen, destino in duplas}
        id_a_titulo = {
            curso["id"]: curso["titulo"]
            for curso in cursos
            if curso["id"] in ids_usados
        }

        G = nx.DiGraph()
        for origen, destino in duplas:
            G.add_edge(id_a_titulo.get(origen, origen), id_a_titulo.get(destino, destino))

        plt.figure(figsize=(12, 6))
        pos = nx.spring_layout(G, k=1.2)
        nx.draw(G, pos, with_labels=True, node_color="lightgreen", node_size=3000, font_size=9, arrows=True)
        plt.title(f"ROADMAP {nivel.upper()} - {tema.upper()}", fontsize=16)
        plt.tight_layout()

        try:
            plt.savefig(LAST_GRAPH_PATH, dpi=300)
        except Exception as e:
            print("No se pudo guardar el gráfico:", str(e))

        plt.close()

    except Exception as e:
        print("[Error al guardar logs]:", str(e))

def generar_respuesta(cursos, duplas):
    ids_usados = {origen for origen, destino in duplas} | {destino for origen, destino in duplas}

    # Mapa código → título
    codigo_a_titulo = {
        curso["id"]: curso["titulo"]
        for curso in cursos
        if curso["id"] in ids_usados
    }

    nodes = [{"id": codigo, "titulo": titulo} for codigo, titulo in codigo_a_titulo.items()]
    edges = duplas  # ya están como [origen, destino] usando códigos

    return {
        "nodes": nodes,
        "edges": edges
    }

# === Configuración de la base de datos ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

# === Ruta principal ===
@app.route("/generar-roadmap", methods=["POST"])
def generar_roadmap():
    data = request.get_json()
    tema = data.get("tema")
    nivel = data.get("nivel", "minimalista").lower()

    if not tema or nivel not in ("minimalista", "detallado"):
        return jsonify({"error": "Parámetros inválidos"}), 400

    # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # DB_PATH = os.path.join(BASE_DIR, "app.db")

    cursos = exportar_cursos_desde_sqlite(DB_PATH)
    prompt = construir_prompt(cursos, tema, nivel)

    messages = [
        ("system", prompt),
        ("human", f"Me gustaría un roadmap sobre {tema}.")
    ]

    try:
        ai_msg = llm.invoke(messages)
        contenido = ai_msg.content
        contenido_limpio = re.sub(r"```json|```", "", contenido).strip()
        duplas = json.loads(contenido_limpio)

        respuesta = generar_respuesta(cursos, duplas)

        # Guardado en segundo plano
        threading.Thread(
            target=guardar_logs,
            args=(contenido, duplas, prompt, cursos, nivel, tema),
            daemon=True
        ).start()

        return jsonify(respuesta)  # Devuelves nodes y edges

    except json.JSONDecodeError as e:
        return jsonify({"error": "La respuesta del modelo no es JSON válido", "detalle": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Error al procesar la respuesta del modelo", "detalle": str(e)}), 500

# === Función para obtener conexión a la base de datos ===
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# === Endpoint para gestionar el login ===
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "mensaje": "Faltan campos obligatorios"}), 400
    
    EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"success": False, "mensaje": "Correo electrónico no válido."}), 400

    try:
        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM usuarios WHERE email = ?", (email,)
        ).fetchone()
        conn.close()

        if user is None or user["password"] != password:
            return jsonify({"success": False, "mensaje": "Usuario y/o contraseña incorrectos"}), 401

        return jsonify({
            "success": True,
            "user_id": user["id"],
            "nombre": user["nombre"]
        })

    except Exception as e:
        print("[Error en login]:", str(e))
        return jsonify({"success": False, "mensaje": "Error interno del servidor"}), 500

# === Endpoint para registrar un nuevo usuario ===
@app.route("/api/registro", methods=["POST"])
def registrar_usuario():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "mensaje": "Faltan campos requeridos."}), 400

    EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"success": False, "mensaje": "Correo electrónico no válido."}), 400

    nombre = email.split("@")[0]

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
            (nombre, email, password)
        )

        conn.commit()
        conn.close()

        return jsonify({"success": True, "mensaje": "Usuario registrado correctamente."}), 201

    except sqlite3.IntegrityError:
        return jsonify({"success": False, "mensaje": "Ya existe una cuenta asociada a este email."}), 409

    except Exception as e:
        # Esto podría ayudarte en debugging, solo mientras estás desarrollando:
        print("[ERROR registro]:", str(e))
        return jsonify({"success": False, "mensaje": "Error interno del servidor."}), 500

# === Endpoint para listar cursos ===
@app.route("/api/cursos", methods=["GET"])
def listar_cursos():
    usuario_id = request.args.get("usuario_id", type=int)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        mensaje = ""
        cursos_comprados = set()

        if usuario_id is not None:
            # Verificar que el usuario existe
            cursor.execute("SELECT id FROM usuarios WHERE id = ?", (usuario_id,))
            usuario = cursor.fetchone()

            if usuario is None:
                mensaje = f"Usuario con ID {usuario_id} no encontrado."
                usuario_id = None  # Anulamos el ID para no seguir buscando cursos comprados
            else:
                mensaje = f"Usuario con ID {usuario_id} detectado."
                
                # Obtener cursos comprados por este usuario
                cursor.execute("""
                    SELECT dc.curso_id
                    FROM compras c
                    JOIN detalle_compra dc ON c.id = dc.compra_id
                    WHERE c.usuario_id = ?
                """, (usuario_id,))
                cursos_comprados = {row["curso_id"] for row in cursor.fetchall()}
        else:
            mensaje = "No se recibió ningún ID de usuario."

        # Obtener todos los cursos activos
        cursor.execute("""
            SELECT id, titulo, nivel, DATE(fecha_creacion) AS fecha_creacion, rating_promedio
            FROM cursos
            WHERE activo = 1
            ORDER BY fecha_creacion DESC
        """)
        cursos = cursor.fetchall()

        # Armar el listado de cursos
        cursos_data = []
        for curso in cursos:
            cursos_data.append({
                "id": curso["id"],
                "titulo": curso["titulo"],
                "nivel": curso["nivel"],
                "fecha_creacion": curso["fecha_creacion"],
                "rating_promedio": curso["rating_promedio"],
                "comprado": curso["id"] in cursos_comprados
            })

        return jsonify({
            "success": True,
            "mensaje": mensaje,
            "cursos": cursos_data
        })

    except Exception as e:
        return jsonify({"success": False, "mensaje": f"Error interno: {str(e)}"}), 500

    finally:
        conn.close()




# === Iniciar la app ===
if __name__ == "__main__":
    app.run(debug=True)




