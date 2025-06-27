# ⚙️ Guía de Instalación y Ejecución

Este directorio contiene el código completo para ejecutar tanto el backend como el frontend  del proyecto [StudIA](https://github.com/DiesmEsp/StudIA.git).

---

## ✅ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

### 🐍 [Miniconda](https://docs.conda.io/en/latest/miniconda.html)

> 💡 **No necesitas instalar Python por separado.**  
> Miniconda ya incluye una instalación de Python que usará Conda internamente para gestionar entornos.

---

## ⚠️ Recomendación para usuarios de Windows

Para evitar errores con rutas y activación de entornos:

👉 **Usa siempre "Anaconda Prompt" o "Miniconda Prompt"** en lugar del CMD convencional.

Puedes encontrarlo fácilmente buscando:

- Presiona `Ctrl + S` (abrir búsqueda de Windows)
- Escribe: `Anaconda Prompt` o `Miniconda Prompt` según el caso

> Esto garantiza que los comandos `conda activate` funcionen correctamente.

---

## 🚀 Instalación y ejecución local

Sigue estos pasos para levantar la aplicación completa:

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiesmEsp/StudIA.git
cd StudIA/app
````

---

### 2. Crear el entorno Conda

```bash
conda env create -f env.yml
```

Esto instalará todas las dependencias necesarias para backend y frontend.

---

### 3. Activar el entorno

```bash
conda activate roadmap_ia
```

---

### 4. Ejecutar el sistema completo

```bash
python run_app.py
```

Este script:

* Inicia el backend en `http://localhost:5000`
* Inicia el frontend estático en `http://localhost:5200`

---

### 5. Probar la aplicación

Abre tu navegador y visita:

```
http://localhost:5200/roadmap.html
```

Desde allí podrás generar roadmaps personalizados y visualizar los cursos relacionados.

---

## 🛑 Para detener la aplicación

Presiona `Ctrl + C` en la terminal donde ejecutaste `run_app.py`.

---

## 📌 Notas

* Ejecuta siempre los comandos desde la carpeta `app/`
* El entorno `roadmap_ia` debe estar activo para que todo funcione correctamente

