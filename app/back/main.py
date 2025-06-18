import os
import re
import json
import sqlite3
import networkx as nx
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
        plt.savefig(LAST_GRAPH_PATH, dpi=300)
        plt.close()

    except Exception as e:
        print("[Error al guardar logs]:", str(e))

# === Ruta principal ===
@app.route("/generar-roadmap", methods=["POST"])
def generar_roadmap():
    data = request.get_json()
    tema = data.get("tema")
    nivel = data.get("nivel", "minimalista").lower()

    if not tema or nivel not in ("minimalista", "detallado"):
        return jsonify({"error": "Parámetros inválidos"}), 400

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_DIR = os.path.join(BASE_DIR, "app.db")

    cursos = exportar_cursos_desde_sqlite(DB_DIR)
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

        # Guardado en segundo plano
        threading.Thread(
            target=guardar_logs,
            args=(contenido, duplas, prompt, cursos, nivel, tema),
            daemon=True
        ).start()

        return jsonify({"aristas": duplas})

    except json.JSONDecodeError as e:
        return jsonify({"error": "La respuesta del modelo no es JSON válido", "detalle": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Error al procesar la respuesta del modelo", "detalle": str(e)}), 500

# === Iniciar la app ===
if __name__ == "__main__":
    app.run(debug=True)




# import os 
# import json
# import re
# import sqlite3
# import networkx as nx
# import matplotlib.pyplot as plt
# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# from langchain_google_genai import ChatGoogleGenerativeAI

# from flask_cors import CORS

# # Configuración inicial
# load_dotenv()
# api_key = os.getenv("GOOGLE_API_KEY")

# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.5-flash-preview-05-20",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
#     google_api_key=api_key
# )

# # App de Flask
# app = Flask(__name__)

# # ✅ Permite solo a tu frontend en 127.0.0.1:5200
# CORS(app)
# # CORS(app, resources={r"/generar-roadmap/": {"origins": "http://127.0.0.1:5200"}})

# # === Función para exportar cursos desde SQLite ===
# def exportar_cursos_desde_sqlite(db_path):
#     conn = sqlite3.connect(db_path)
#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT id, codigo, titulo, descripcion, nivel
#         FROM cursos
#         ORDER BY id
#     """)
#     cursos = cursor.fetchall()

#     resultado = []
#     for curso in cursos:
#         curso_id, codigo, titulo, descripcion, nivel = curso

#         cursor.execute("""
#             SELECT tema FROM curso_temas
#             WHERE curso_id = ?
#         """, (curso_id,))
#         temas = [row[0] for row in cursor.fetchall()]

#         resultado.append({
#             "id": codigo,
#             "titulo": titulo,
#             "descripcion": descripcion,
#             "temas": temas,
#             "nivel": nivel
#         })

#     conn.close()
#     return resultado

# # === Función para construir el prompt ===
# def construir_prompt(cursos, tema_usuario, nivel):
#     prompt = f"""
# Eres un planificador experto en rutas de aprendizaje.

# Con la lista de cursos que te doy a continuación, construye un roadmap de aprendizaje.

# Tu objetivo es seleccionar los cursos más relevantes que contribuyan al dominio del tema, considerando temas, nivel de dificultad y prerequisitos.
# """
#     if nivel == "minimalista":
#         prompt += """
# Selecciona solo los cursos estrictamente necesarios para comprender y dominar el tema principal, sin incluir cursos complementarios ni tecnologías adyacentes.
# """
#     elif nivel == "detallado":
#         prompt += """
# Además de los cursos directamente relacionados con el tema, puedes incluir algunos cursos complementarios que aporten fundamentos técnicos o habilidades transversales útiles en contextos reales.

# Evita incluir cursos centrados en tecnologías no esenciales al tema principal.
# """

#     prompt += f"""

# Devuélveme exclusivamente una lista de aristas (duplas) en este formato:

# [["curso_prerrequisito_id", "curso_dependiente_id"], ...]

# Cada dupla indica que el primer curso debe ser completado antes que el segundo. Ordena el camino desde los más básicos hasta los más avanzados.

# NO incluyas explicaciones ni textos adicionales, solo la lista JSON con las duplas.

# Aquí está la lista de cursos:
# {json.dumps(cursos, ensure_ascii=False)}
# """
#     return prompt.strip()


# # === Middleware para imprimir headers de solicitud y respuesta ===
# # @app.after_request
# # def after_request(response):
# #     # Headers CORS necesarios
# #     response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:5200")
# #     response.headers.add("Access-Control-Allow-Headers", "*")
# #     response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

# #     # Mostrar en consola los headers de respuesta
# #     print("=== RESPONSE HEADERS ===")
# #     for k, v in response.headers.items():
# #         print(f"{k}: {v}")
# #     return response

# # === Ruta principal para generar el roadmap ===
# @app.route("/generar-roadmap/", methods=["POST"])
# def generar_roadmap():
#     data = request.get_json()

#     tema = data.get("tema")
#     nivel = data.get("nivel", "minimalista").lower()

#     if not tema or nivel not in ("minimalista", "detallado"):
#         return jsonify({"error": "Parámetros inválidos"}), 400

#     BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#     DB_DIR = os.path.join(BASE_DIR, "app.db")
#     # LOGS_DIR = os.path.join(BASE_DIR, "logs")

#     # Obtener cursos desde SQLite
#     cursos = exportar_cursos_desde_sqlite(DB_DIR)

#     # Construir prompt
#     prompt = construir_prompt(cursos, tema, nivel)

#     # Llamada al modelo Gemini
#     messages = [
#         ("system", prompt),
#         ("human", f"Me gustaría un roadmap sobre {tema}.")
#     ]

#     try:
#         ai_msg = llm.invoke(messages)
#         contenido = ai_msg.content
#         contenido_limpio = re.sub(r"```json|```", "", contenido).strip()

#         # # === GUARDAR LOGS ===
#         # os.makedirs(LOGS_DIR, exist_ok=True)

#         # RAW_RESPONSE_PATH = os.path.join(LOGS_DIR, "raw_response.txt")
#         # LAST_PROMPT_PATH = os.path.join(LOGS_DIR, "last_prompt.txt")
#         # LAST_OUTPUT_PATH = os.path.join(LOGS_DIR, "last_output.json")
#         # LAST_GRAPH_PATH = os.path.join(LOGS_DIR, "last_graph.png")
        
#         # # TEMP: guardar contenido bruto
#         # with open(RAW_RESPONSE_PATH, "w", encoding="utf-8") as f:
#         #     f.write(contenido)
        
#         duplas = json.loads(contenido_limpio)        

#         # # 1. Guardar prompt
#         # with open(LAST_PROMPT_PATH, "w", encoding="utf-8") as f:
#         #     f.write(prompt)

#         # # 2. Guardar output
#         # with open(LAST_OUTPUT_PATH, "w", encoding="utf-8") as f:
#         #     json.dump(duplas, f, indent=2, ensure_ascii=False)

#         # # 3. Guardar grafo
#         # ids_usados = {origen for origen, destino in duplas} | {destino for origen, destino in duplas}
#         # id_a_titulo = {
#         #     curso["id"]: curso["titulo"]
#         #     for curso in cursos
#         #     if curso["id"] in ids_usados
#         # }

#         # G = nx.DiGraph()
#         # for origen, destino in duplas:
#         #     G.add_edge(id_a_titulo.get(origen, origen), id_a_titulo.get(destino, destino))

#         # plt.figure(figsize=(12, 6))
#         # pos = nx.spring_layout(G, k=1.2)
#         # nx.draw(
#         #     G, pos, with_labels=True,
#         #     node_color="lightgreen", node_size=3000,
#         #     font_size=9, arrows=True
#         # )
#         # plt.title(f"ROADMAP {nivel.upper()} - {tema.upper()}", fontsize=16)
#         # plt.tight_layout()
#         # plt.savefig(LAST_GRAPH_PATH, dpi=300)
#         # plt.close()

#     except json.JSONDecodeError as e:
#         return jsonify({
#             "error": "La respuesta del modelo no es JSON válido",
#             "detalle": str(e)
#         }), 500
#     except Exception as e:
#         return jsonify({"error": "Error al procesar la respuesta del modelo", "detalle": str(e)}), 500

#     return jsonify({"aristas": duplas})

# # === Arrancar la app ===
# if __name__ == "__main__":
#     app.run(debug=True)


# # PRUEBA
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import time

# import os
# from dotenv import load_dotenv
# from langchain_google_genai import ChatGoogleGenerativeAI

# # Configuración inicial
# load_dotenv()
# api_key = os.getenv("GOOGLE_API_KEY")

# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.5-flash-preview-05-20",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
#     google_api_key=api_key
# )

# app = Flask(__name__)
# # solo permite al front en 5200
# CORS(app, resources={r"/generar-roadmap": {"origins": "http://127.0.0.1:5200"}})

# @app.route("/generar-roadmap", methods=["POST"])
# def generar_roadmap():
#     data = request.get_json()
#     tema  = data.get("tema", "")
#     nivel = data.get("nivel", "")

#     # time.sleep(60)

#     # Llamada al modelo Gemini
#     messages = [
#         ("human", f"Como describirias {tema} en una frase?.")
#     ]

#     try:
#         ai_msg = llm.invoke(messages)
#         contenido = ai_msg.content

#         return jsonify({"respuesta": contenido})
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     # return jsonify({"aristas": [["C1","C2"], ["C1","C3"]], "tema": tema, "nivel": nivel})

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)