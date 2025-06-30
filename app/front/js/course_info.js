document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get("id");

    if (!cursoId) {
        alert("No se especificó ningún curso.");
        return;
    }

    fetch(`http://127.0.0.1:5000/api/curso/${cursoId}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert("Error: " + data.mensaje);
                return;
            }

            const curso = data.curso;

            // Rellenar los elementos del DOM
            document.getElementById("course-name").textContent = curso.titulo;
            document.getElementById("course-description").textContent = curso.descripcion;
            document.getElementById("add-to-cart").textContent = `S/. ${curso.precio.toFixed(2)}`;

            // (Opcional) Mostrar los temas
            if (curso.temas && curso.temas.length > 0) {
                const temasDiv = document.createElement("div");
                temasDiv.classList.add("temas");

                const tituloTemas = document.createElement("h4");
                tituloTemas.textContent = "Temas del curso:";
                temasDiv.appendChild(tituloTemas);

                const ul = document.createElement("ul");
                curso.temas.forEach(tema => {
                    const li = document.createElement("li");
                    li.textContent = tema;
                    ul.appendChild(li);
                });

                temasDiv.appendChild(ul);

                document.querySelector(".course-details").appendChild(temasDiv);
            }

        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar la información del curso.");
        });
});
