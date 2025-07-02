document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createCourseForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // 1. Recoger datos del formulario
        const cursoData = {
            titulo: document.getElementById("titulo").value,
            descripcion: document.getElementById("descripcion").value,
            nivel: document.getElementById("nivel").value,
            duracion: document.getElementById("duracion").value,
            precio: document.getElementById("precio").value,
            silabo_url: document.getElementById("Sylabo-URL").value,
            contenido_url: document.getElementById("Video-URL").value
        };

        // 2. Enviar a la API
        try {
            const response = await fetch("http://localhost:5000/api/admin/curso", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cursoData)
            });

            const result = await response.json();

            // 3. Mostrar resultado
            if (response.ok) {
                alert("Curso creado con éxito! ID: " + (result.codigo || ''));
                form.reset(); // Limpiar formulario
            } else {
                alert("Error: " + (result.mensaje || 'Error desconocido'));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        }
    });
});