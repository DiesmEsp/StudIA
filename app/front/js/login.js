document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const payload = { email, password };

        try {
            const res = await fetch("http://127.0.0.1:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Guardar datos en localStorage
                localStorage.setItem("usuario", JSON.stringify({
                    id: data.id,
                    nombre: data.nombre
                }));

                // Redirigir al inicio
                window.location.href = "/index.html";
            } else {
                // Mostrar mensaje del backend
                console.error("Error de inicio de sesión:", data);
                alert(data.mensaje || "Error al iniciar sesión.");
            }

        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
