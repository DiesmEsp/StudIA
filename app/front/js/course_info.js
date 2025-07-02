document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get("id");

    if (!cursoId) {
        alert("No se especificó ningún curso.");
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioId = usuario?.id;

    // Añade esto al principio del archivo
    function setupPurchasedCourseButton(button, curso) {
        button.textContent = "Ver curso";
        button.disabled = false;
        button.style.backgroundColor = "#4CAF50";
        button.style.cursor = "pointer";
        button.onclick = () => curso.contenido_url && window.open(curso.contenido_url, "_blank");
        button.onmouseover = null;
        button.onmouseout = null;
    }

    // Construye la URL según si hay usuario logueado
    const url = usuarioId
        ? `http://127.0.0.1:5000/api/curso/${cursoId}?usuario_id=${usuarioId}`
        : `http://127.0.0.1:5000/api/curso/${cursoId}`;

    fetch(url)
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
            nivelElem.innerHTML = `<b>Nivel:</b> ${capitalizeFirst(curso.nivel)}`;

            document.getElementById("course-description").textContent = curso.descripcion;

            // --- Botón de precio / carrito ---
            const addToCartBtn = document.getElementById("add-to-cart");

            // Limpia eventos previos SIEMPRE
            addToCartBtn.onmouseover = null;
            addToCartBtn.onmouseout = null;
            addToCartBtn.onclick = null;

            // Caso 4: No logueado
            if (!usuarioId) {
                const precioTexto = `S/. ${curso.precio.toFixed(2)}`;
                addToCartBtn.textContent = precioTexto;
                addToCartBtn.disabled = false;
                addToCartBtn.style.backgroundColor = "#4CAF50";
                addToCartBtn.style.cursor = "pointer";
                addToCartBtn.onclick = () => {
                    window.location.href = "inicio_sesion.html";
                };
                addToCartBtn.onmouseover = function () {
                    if (!this.disabled) this.textContent = "Inicia sesión para comprar";
                };
                addToCartBtn.onmouseout = function () {
                    if (!this.disabled) this.textContent = precioTexto;
                };
            } else if (curso.comprado) {
                // CASO 3 MODIFICADO - Curso comprado (ahora es clickeable)
                setupPurchasedCourseButton(addToCartBtn, curso);
            } else {
                // Caso 2: ¿Ya en carrito?
                fetch(`http://127.0.0.1:5000/api/carrito/${usuarioId}`)
                    .then(res => res.json())
                    .then(carritoData => {
                        const yaEnCarrito = carritoData.cursos.some(c => c.id === curso.id);
                        if (yaEnCarrito) {
                            addToCartBtn.textContent = "Ya en tu carrito";
                            addToCartBtn.disabled = true;
                            addToCartBtn.style.backgroundColor = "#bdbdbd";
                            addToCartBtn.style.cursor = "not-allowed";
                            // LIMPIA eventos SIEMPRE
                            addToCartBtn.onmouseover = null;
                            addToCartBtn.onmouseout = null;
                            addToCartBtn.onclick = null;
                        } else {
                            // Caso 1: Puede añadir al carrito
                            const precioTexto = `S/. ${curso.precio.toFixed(2)}`;
                            addToCartBtn.textContent = precioTexto;
                            addToCartBtn.disabled = false;
                            addToCartBtn.style.backgroundColor = "#4CAF50";
                            addToCartBtn.style.cursor = "pointer";
                            addToCartBtn.onmouseover = function () {
                                if (!this.disabled) this.textContent = "Añadir al Carrito";
                            };
                            addToCartBtn.onmouseout = function () {
                                if (!this.disabled) this.textContent = precioTexto;
                            };
                            addToCartBtn.onclick = function () {
                                fetch("http://127.0.0.1:5000/api/carrito", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        usuario_id: usuarioId,
                                        curso_id: curso.id
                                    })
                                })
                                .then(res => res.json())
                                .then(resp => {
                                    if (resp.success) {
                                        addToCartBtn.textContent = "Ya en tu carrito";
                                        addToCartBtn.disabled = true;
                                        addToCartBtn.style.backgroundColor = "#bdbdbd";
                                        addToCartBtn.style.cursor = "not-allowed";
                                        // LIMPIA eventos SIEMPRE
                                        addToCartBtn.onmouseover = null;
                                        addToCartBtn.onmouseout = null;
                                        addToCartBtn.onclick = null;
                                    } else {
                                        alert(resp.mensaje || "No se pudo añadir al carrito.");
                                    }
                                })
                                .catch(() => alert("Error al añadir al carrito."));
                            };
                        }
                    });
            }

            // Imagen
            document.getElementById("course-img").src = curso.imagen || "images/img4.png";

            // Botón PDF - Versión mejorada
            const pdfBtn = document.getElementById("pdf-btn");
            if (pdfBtn) {
                if (curso.silabo_url) {
                    pdfBtn.style.display = "inline-block";
                    pdfBtn.onclick = function() {
                        // Abre el PDF en nueva pestaña
                        window.open(curso.silabo_url, "_blank");
                        
                        // Opcional: Si prefieres visualizador embebido
                        // window.open(`/pdf-viewer.html?url=${encodeURIComponent(curso.silabo_url)}`, "_blank");
                    };
                } else {
                    pdfBtn.style.display = "inline-block";
                    pdfBtn.onclick = function() {
                        showPopup(); // Muestra el popup existente de "Lo sentimos"
                    };
                }
            }

            // Mostrar los temas
            const detallesDiv = document.querySelector(".course-details");
            const temasPrevios = detallesDiv.querySelector(".temas");
            if (temasPrevios) temasPrevios.remove();

            if (curso.temas && curso.temas.length > 0) {
                const temasDiv = document.createElement("div");
                temasDiv.classList.add("temas");

                const tituloTemas = document.createElement("h4");
                tituloTemas.textContent = "Temas del curso:";
                tituloTemas.style.marginBottom = "5px"; // reduce espacio
                temasDiv.appendChild(tituloTemas);

                // Crear los temas sin usar <ul> ni <li>
                curso.temas.forEach(tema => {
                    const temaDiv = document.createElement("div");
                    const temaCapitalizado = tema.charAt(0).toUpperCase() + tema.slice(1);
                    
                    // Agregar el ícono de ✔︎ y el tema con formato
                    temaDiv.innerHTML = `✔︎ <span class="tema-text">${temaCapitalizado}</span>`;
                    temaDiv.style.marginBottom = "8px"; // Espacio entre los temas
                    temaDiv.style.fontSize = "1.1em"; // Ajustar tamaño de texto
                    temaDiv.style.fontWeight = "normal"; // Peso de texto normal
                    temaDiv.style.color = "#333"; // Color del texto
                    temaDiv.style.paddingLeft = "20px"; // Agregar tabulación antes del texto

                    temasDiv.appendChild(temaDiv);
                });

                // Fecha de publicación
                const fechaP = document.createElement("p");
                fechaP.style.marginTop = "15px";
                fechaP.innerHTML = "📅 <strong>Fecha de publicación: </strong>" + formatFecha(curso.fecha_creacion);
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

            function generarEstrellas(rating) {
                const maxStars = 5;
                const fullStars = Math.round(rating);  // redondea a la estrella más cercana
                const emptyStars = maxStars - fullStars;

                return '⭐'.repeat(fullStars) + '☆'.repeat(emptyStars);
            }

            ratingElem.innerHTML = `👍 <strong>Valoración:</strong> ${generarEstrellas(curso.rating_promedio)} (${curso.rating_promedio})`;


            // Duración en horas y minutos
            let duracionElem = document.getElementById("course-duracion");
            if (!duracionElem) {
                duracionElem = document.createElement("p");
                duracionElem.id = "course-duracion";
                detallesDiv.appendChild(duracionElem);
            }
            duracionElem.innerHTML = "⏱️ <strong>Duración: </strong>" + minutosAHorasMinutos(curso.duracion);

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