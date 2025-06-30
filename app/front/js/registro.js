document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Validación de contraseña
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const payload = {
            email: email,
            password: password
        };

        try {
            const response = await fetch("http://localhost:5000/api/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("Respuesta de la API:", data);

            if (response.ok && data.success) {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                window.location.href = "/inicio_sesion.html";
            } else {
                alert(`${data.mensaje || "Error en el registro."}`);
            }

        } catch (error) {
            console.error("Error al conectar con la API:", error);
            alert("Error en el servidor. Intenta más tarde.");
        }
    });
});
