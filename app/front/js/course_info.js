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

            // Nivel debajo del título
            let nivelElem = document.getElementById("course-nivel");
            if (!nivelElem) {
                nivelElem = document.createElement("p");
                nivelElem.id = "course-nivel";
                document.getElementById("course-name").after(nivelElem);
            }
            nivelElem.textContent = `Nivel: ${capitalizeFirst(curso.nivel)}`;

            document.getElementById("course-description").textContent = curso.descripcion;

            // --- Botón de precio con hover ---
            const addToCartBtn = document.getElementById("add-to-cart");
            const precioTexto = `S/. ${curso.precio.toFixed(2)}`;
            addToCartBtn.textContent = precioTexto;
            addToCartBtn.setAttribute("data-price", precioTexto);

            addToCartBtn.onmouseover = function () {
                this.textContent = "Añadir al Carrito";
            };
            addToCartBtn.onmouseout = function () {
                this.textContent = this.getAttribute("data-price");
            };

            // Imagen
            document.getElementById("course-img").src = curso.imagen || "images/img4.png";

            // PDF
            const pdfBtn = document.getElementById("pdf-btn");
            if (pdfBtn) {
                if (curso.pdf_url) {
                    pdfBtn.style.display = "inline-block";
                    pdfBtn.onclick = function () {
                        window.open(curso.pdf_url, "_blank");
                    };
                } else {
                    pdfBtn.style.display = "inline-block";
                    pdfBtn.onclick = function () {
                        if (typeof showPopup === "function") {
                            showPopup();
                        } else {
                            alert("Lo sentimos. Este curso no tiene un sílabus disponible por el momento.");
                        }
                    };
                }
            }

            // (Opcional) Mostrar los temas
            const detallesDiv = document.querySelector(".course-details");
            // Elimina temas previos si recargas
            const temasPrevios = detallesDiv.querySelector(".temas");
            if (temasPrevios) temasPrevios.remove();

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

                // Fecha de publicación (formateada)
                const fechaP = document.createElement("p");
                fechaP.style.marginTop = "15px";
                fechaP.textContent = "Fecha de publicación: " + formatFecha(curso.fecha_creacion);
                temasDiv.appendChild(fechaP);

                detallesDiv.appendChild(temasDiv);
            }

            // Rating promedio (★)
            let ratingElem = document.getElementById("course-rating");
            if (!ratingElem) {
                ratingElem = document.createElement("p");
                ratingElem.id = "course-rating";
                detallesDiv.appendChild(ratingElem);
            }
            ratingElem.innerHTML = `&#9733; ${curso.rating_promedio}`;

            // Duración en horas y minutos
            let duracionElem = document.getElementById("course-duracion");
            if (!duracionElem) {
                duracionElem = document.createElement("p");
                duracionElem.id = "course-duracion";
                detallesDiv.appendChild(duracionElem);
            }
            duracionElem.textContent = "Duración: " + minutosAHorasMinutos(curso.duracion);

        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar la información del curso.");
        });

    // Función para capitalizar la primera letra
    function capitalizeFirst(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Formatea la fecha a "11 de junio del 2025"
    function formatFecha(fechaStr) {
        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const [anio, mes, dia] = fechaStr.split("-");
        return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} del ${anio}`;
    }

    // Convierte minutos a "Xh Ym"
    function minutosAHorasMinutos(minutos) {
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        return `${h}h ${m}m`;
    }
});