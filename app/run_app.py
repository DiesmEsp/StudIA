# run_app.py

import subprocess
import os
import time

# Ir al directorio de trabajo raíz del proyecto
os.chdir(os.path.dirname(__file__))

print("[SYSTEM] Iniciando backend (Flask)...")
backend = subprocess.Popen(["python", "back/main.py"])

# Esperar un poco por si acaso
time.sleep(1)

print("[SYSTEM] Iniciando frontend (http.server)...")
frontend = subprocess.Popen(["python", "-m", "http.server", "5200"], cwd="front")

try:
    backend.wait()
except KeyboardInterrupt:
    print("\n[SYSTEM] Deteniendo procesos...")
    backend.terminate()
    frontend.terminate()
