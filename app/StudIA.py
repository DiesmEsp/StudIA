import subprocess
import os
import time
import threading
import webview

def start_backend():
    print("[SYSTEM] Iniciando backend (Flask)...")
    subprocess.Popen(["python", "back/main.py"])

def start_frontend():
    print("[SYSTEM] Iniciando frontend (http.server)...")
    subprocess.Popen(["python", "-m", "http.server", "5200"], cwd="front")

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))

    # Ejecutar ambos en hilos separados
    threading.Thread(target=start_backend, daemon=True).start()
    time.sleep(1)
    threading.Thread(target=start_frontend, daemon=True).start()
    time.sleep(2)  # Esperar a que ambos servicios levanten

    # Mostrar el frontend en una ventana
    webview.create_window("StudIA", "http://127.0.0.1:5200/index.html")
    webview.start()
