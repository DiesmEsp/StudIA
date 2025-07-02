document.addEventListener("DOMContentLoaded", () => {
    const btnCargar = document.getElementById("btnCargar");

    btnCargar.addEventListener("click", async () => {
        const cursoId = document.getElementById("ID").value.trim();

        if (!cursoId) {
            alert("Por favor ingresa un ID de curso.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/curso/${cursoId}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                alert("Error al cargar el curso: " + (data.mensaje || "Curso no encontrado"));
                return;
            }

            const curso = data.curso;

            // Llenar los campos del formulario
            document.getElementById("titulo").value       = curso.titulo;
            document.getElementById("descripcion").value  = curso.descripcion;
            document.getElementById("nivel").value        = curso.nivel;
            document.getElementById("duracion").value     = curso.duracion;
            document.getElementById("precio").value       = curso.precio;
            document.getElementById("video_url").value    = curso.contenido_url || "";
            document.getElementById("silabo_url").value   = curso.silabo_url || "";

            alert("Curso cargado correctamente ✅");

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor.");
        }
    });
});
