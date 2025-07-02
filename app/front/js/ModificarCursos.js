document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createCourseForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cursoId = document.getElementById("ID").value.trim();

        if (!cursoId) {
            alert("Debes cargar primero un curso válido.");
            return;
        }

        const payload = {
            titulo:        document.getElementById("titulo").value,
            descripcion:   document.getElementById("descripcion").value,
            nivel:         document.getElementById("nivel").value,
            duracion:      document.getElementById("duracion").value,
            precio:        document.getElementById("precio").value,
            contenido_url: document.getElementById("video_url").value,
            silabo_url:    document.getElementById("silabo_url").value
        };

        try {
            const res = await fetch(`http://localhost:5000/api/admin/curso/${cursoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Curso modificado correctamente ✅");
                form.reset();
            } else {
                alert("Error: " + (data.mensaje || "No se pudo modificar el curso"));
            }

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor.");
        }
    });
});
