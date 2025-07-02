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
                console.log("Inicio de sesión exitoso:", data);

                // Guardar datos en localStorage (incluyendo el rol)
                localStorage.setItem("usuario", JSON.stringify({
                    id: data.user_id,
                    nombre: data.nombre,
                    rol: data.rol
                }));

                // Mostrar mensaje de éxito
                alert("Inicio de sesión exitoso. Bienvenido!");

                // Redirigir según el rol
                if (data.rol === "admin") {
                    window.location.href = "/MenuDashboradAdmin.html";
                } else {
                    window.location.href = "/index.html";
                }

            } else {
                console.error("Error de inicio de sesión:", data);
                alert(data.mensaje || "Error al iniciar sesión.");
            }

        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
