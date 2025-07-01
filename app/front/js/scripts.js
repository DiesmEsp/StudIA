// // Validación de formulario en la página de inicio de sesión
// const loginForm = document.getElementById("login-form");
// if (loginForm) {
//     loginForm.addEventListener("submit", function(event) {
//         event.preventDefault();

//         let email = document.getElementById("email").value;
//         let password = document.getElementById("password").value;

//         // Validación simple (puedes agregar más validaciones aquí)
//         if(email && password) {
//             alert("Formulario enviado con éxito!");
//         } else {
//             alert("Por favor, completa todos los campos.");
//         }
//     });
// }

// Actualiza el valor de presupuesto cuando se mueve la barra
function updateBudgetValue() {
    var budget = document.getElementById('budget')?.value;
    if (budget && document.getElementById('budget-value')) {
        document.getElementById('budget-value').textContent = parseFloat(budget).toFixed(2);
    }
}

// Mostrar campo de detalles cuando se selecciona "Soy Nuevo"
const newCheckbox = document.getElementById('new');
if (newCheckbox) {
    newCheckbox.addEventListener('change', function () {
        var detailsField = document.getElementById('knowledge-details');
        if (detailsField) {
            detailsField.style.display = this.checked ? 'block' : 'none';
        }
    });
}

// Función para cambiar el texto del botón al pasar el puntero por encima
const addToCartBtn = document.getElementById("add-to-cart");
if (addToCartBtn) {
    addToCartBtn.dataset.price = addToCartBtn.textContent;
    addToCartBtn.addEventListener("mouseover", function () {
        this.textContent = "Añadir al Carrito";
    });
    addToCartBtn.addEventListener("mouseout", function () {
        this.textContent = this.dataset.price;
    });
}

// Mostrar información del curso y cargar el contenido dinámicamente
function loadCourseData(courseData) {
    const courseImage = courseData.image || "images/img4.png";
    const coursePrice = courseData.price ? `S/. ${courseData.price.toFixed(2)}` : "S/. 0.00";
    const courseName = courseData.name || "Nombre del Curso";
    const courseDescription = courseData.description || "[descripción]";
    const pdfLink = courseData.pdf || null;

    // Asignar datos al DOM solo si existen los elementos
    const imgElem = document.getElementById("course-img");
    const btnElem = document.getElementById("add-to-cart");
    const nameElem = document.getElementById("course-name");
    const descElem = document.getElementById("course-description");

    if (imgElem) imgElem.src = courseImage;
    if (btnElem) {
        btnElem.textContent = coursePrice;
        btnElem.dataset.price = coursePrice;
    }
    if (nameElem) nameElem.textContent = courseName;
    if (descElem) descElem.textContent = courseDescription;

    // Configuración del botón PDF
    const pdfBtn = document.getElementById("pdf-btn");
    if (pdfBtn) {
        if (pdfLink) {
            pdfBtn.style.display = "inline-block";
            pdfBtn.onclick = function () {
                window.open(pdfLink, "_blank");
            };
        } else {
            pdfBtn.style.display = "inline-block";
            pdfBtn.onclick = function () {
                showPopup();
            };
        }
    }
}

// Función para mostrar la ventana emergente
function showPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <img src="images/ups.png" alt="Ups" class="popup-img">
            <p>Lo sentimos. Este curso no tiene un sílabus disponible por el momento.</p>
            <button class="popup-btn" onclick="closePopup()">Ok</button>
        </div>
    `;
    document.body.appendChild(popup);
}

// Función para cerrar el popup
function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) popup.remove();
}

/*
// Esta función se llamará cuando tengamos los datos del JSON
if (document.getElementById("course-img")) {
    loadCourseData({
        image: "images/img4.png",
        price: 79.65,
        name: "Curso de Ejemplo: JAVA",
        description: "El mejor curso de Java Avanzado que jamás en tu pobre vida verás.",
        pdf: null
    });
}
*/

// ===================== LÓGICA POR PÁGINA =====================

document.addEventListener('DOMContentLoaded', async function () {

    // ----------- course_list.html -----------
    if (document.getElementById('course-list-page')) {
        const user = JSON.parse(localStorage.getItem("usuario"));
        const userId = user?.id || null;

        const courseList = document.getElementById('course-list');
        const loadMoreBtn = document.getElementById('load-more');
        const sortOptions = document.getElementById('sort-options');

        if (!courseList || !loadMoreBtn || !sortOptions) {
            console.error("ERROR: Elementos del DOM no encontrados");
            return;
        }

        let courses = [];
        let renderedCount = 0;

        function renderCourses(coursesToRender, append = false) {
            if (!append) courseList.innerHTML = '';
            coursesToRender.forEach(curso => {
                const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                const comprado = curso.comprado ? '<span class="comprado">Comprado ✅</span>' : '';
                const div = document.createElement('div');
                div.className = 'course-item';
                div.innerHTML = `
                    <div class="circle" style="background-color: #${randomColor}"></div>
                    <div class="details">
                        <h3>${curso.titulo}</h3>
                        <p>${curso.nivel ? 'Nivel: ' + curso.nivel : ''}</p>
                        <p>Fecha: ${curso.fecha_creacion || ''}</p>
                        <p class="rating">★ ${curso.rating_promedio !== undefined ? curso.rating_promedio : ''}</p>
                        ${comprado}
                    </div>
                `;
                div.onclick = () => {
                    window.location.href = `course_info.html?id=${curso.id}`;
                };
                courseList.appendChild(div);
            });
        }

        // Construye la URL según si hay usuario
        let url = 'http://localhost:5000/api/cursos';
        if (userId) url += `?usuario_id=${userId}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.success && Array.isArray(data.cursos)) {
                courses = data.cursos;
            } else {
                alert("No se pudieron cargar los cursos.");
                return;
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
            return;
        }

        renderCourses(courses.slice(0, 10));
        renderedCount = 10;

        sortOptions.addEventListener('change', function (e) {
            const sortedCourses = [...courses];
            const option = e.target.value;

            if (option === 'most-popular') {
                sortedCourses.sort((a, b) => b.rating_promedio - a.rating_promedio);
            } else if (option === 'least-popular') {
                sortedCourses.sort((a, b) => a.rating_promedio - b.rating_promedio);
            } else if (option === 'most-recent') {
                sortedCourses.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
            } else if (option === 'least-recent') {
                sortedCourses.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
            }

            renderCourses(sortedCourses.slice(0, renderedCount));
        });

        loadMoreBtn.addEventListener('click', function () {
            const moreCourses = courses.slice(renderedCount, renderedCount + 10);
            renderCourses(moreCourses, true);
            renderedCount += moreCourses.length;
        });
    }

    /*
    // ----------- course_info.html -----------
    if (document.getElementById('course-info-page')) {
        const params = new URLSearchParams(window.location.search);
        const cursoId = params.get("id");
        if (!cursoId) {
            alert("No se encontró el ID del curso.");
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
                            showPopup();
                        };
                    }
                }

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
    }
    */
});