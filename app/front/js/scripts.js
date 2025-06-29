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
    var budget = document.getElementById('budget').value;
    document.getElementById('budget-value').textContent = parseFloat(budget).toFixed(2);
}

// Mostrar campo de detalles cuando se selecciona "Soy Nuevo"
const newCheckbox = document.getElementById('new');
if (newCheckbox) {
    newCheckbox.addEventListener('change', function () {
        var detailsField = document.getElementById('knowledge-details');
        if (this.checked) {
            detailsField.style.display = 'block';
        } else {
            detailsField.style.display = 'none';
        }
    });
}

// Función para cambiar el texto del botón al pasar el puntero por encima
const addToCartBtn = document.getElementById("add-to-cart");
if (addToCartBtn) {
    // Guarda el precio real en un atributo data
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
        btnElem.dataset.price = coursePrice; // Actualiza el atributo data con el precio correcto
    }
    if (nameElem) nameElem.textContent = courseName;
    if (descElem) descElem.textContent = courseDescription;

    // Configuración del botón PDF
    if (pdfLink) {
        const pdfBtn = document.getElementById("pdf-btn");
        if (pdfBtn) {
            if (courseData.pdf) {
                pdfBtn.style.display = "inline-block";
                pdfBtn.onclick = function () {
                    window.open(courseData.pdf, "_blank");
                };
            } else {
                pdfBtn.style.display = "none";
            }
        }
    } else {
        // Mostrar ventana emergente si no hay enlace al PDF
        document.getElementById("pdf-btn").onclick = function () {
            showPopup();  // Llamamos la función para mostrar el popup
        };
    }
}

// Función para mostrar la ventana emergente
function showPopup() {
    // Crear el contenedor emergente
    const popup = document.createElement('div');
    popup.className = 'popup'; // Usamos la clase popup

    // Agregar contenido al popup
    popup.innerHTML = `
        <div class="popup-content">
            <img src="images/ups.png" alt="Ups" class="popup-img">
            <p>Lo sentimos. Este curso no tiene un sílabus disponible por el momento.</p>
            <button class="popup-btn" onclick="closePopup()">Ok</button>
        </div>
    `;
    document.body.appendChild(popup);  // Añadimos el popup al body
}

// Función para cerrar el popup
function closePopup() {
    const popup = document.querySelector('.popup');  // Seleccionamos el popup
    if (popup) {
        popup.remove();  // Lo eliminamos del DOM
    }
}

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

// Lista de cursos
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente cargado - Iniciando script");

    // Datos de ejemplo
    const courses = [
        { title: 'JavaScript', description: 'Aprende JS desde cero', creationDate: '2023-01-01', rating: 4.5 },
        { title: 'Python', description: 'Curso completo de Python', creationDate: '2023-02-15', rating: 4.2 },
        { title: 'React', description: 'Aprende React profesional', creationDate: '2023-03-10', rating: 4.7 },
        { title: 'Node.js', description: 'Backend con Node.js y Express', creationDate: '2023-04-05', rating: 4.6 },
        { title: 'HTML5 y CSS3', description: 'Diseño web moderno', creationDate: '2023-05-12', rating: 4.4 },
        { title: 'Angular', description: 'Desarrollo de aplicaciones con Angular', creationDate: '2023-06-01', rating: 4.3 },
        { title: 'Vue.js', description: 'Curso práctico de Vue.js', creationDate: '2023-06-20', rating: 4.5 },
        { title: 'TypeScript', description: 'Domina TypeScript desde cero', creationDate: '2023-07-10', rating: 4.6 },
        { title: 'Java', description: 'Programación orientada a objetos con Java', creationDate: '2023-07-25', rating: 4.4 },
        { title: 'C#', description: 'Desarrollo de aplicaciones con C#', creationDate: '2023-08-05', rating: 4.3 },
        { title: 'PHP', description: 'Desarrollo web con PHP y MySQL', creationDate: '2023-08-18', rating: 4.2 },
        { title: 'Ruby on Rails', description: 'Web apps con Ruby on Rails', creationDate: '2023-09-01', rating: 4.1 },
        { title: 'Swift', description: 'Desarrollo iOS con Swift', creationDate: '2023-09-15', rating: 4.5 },
        { title: 'Kotlin', description: 'Apps Android con Kotlin', creationDate: '2023-10-01', rating: 4.4 },
        { title: 'Flutter', description: 'Apps móviles con Flutter y Dart', creationDate: '2023-10-20', rating: 4.6 },
        { title: 'Django', description: 'Web profesional con Django', creationDate: '2023-11-05', rating: 4.7 },
        { title: 'Laravel', description: 'Framework PHP Laravel', creationDate: '2023-11-18', rating: 4.3 },
        { title: 'SQL', description: 'Bases de datos y SQL', creationDate: '2023-12-01', rating: 4.5 },
        { title: 'MongoDB', description: 'Bases de datos NoSQL con MongoDB', creationDate: '2023-12-15', rating: 4.4 },
        { title: 'Git y GitHub', description: 'Control de versiones con Git y GitHub', creationDate: '2024-01-05', rating: 4.8 },
        { title: 'Docker', description: 'Contenedores y DevOps con Docker', creationDate: '2024-01-20', rating: 4.6 },
        { title: 'AWS', description: 'Servicios en la nube con AWS', creationDate: '2024-02-01', rating: 4.5 },
        { title: 'Linux', description: 'Administración básica de Linux', creationDate: '2024-02-15', rating: 4.4 },
        { title: 'C++', description: 'Programación avanzada en C++', creationDate: '2024-03-01', rating: 4.3 },
        { title: 'Go', description: 'Desarrollo backend con Go', creationDate: '2024-03-15', rating: 4.2 },
        { title: 'Unity', description: 'Desarrollo de videojuegos con Unity', creationDate: '2024-04-01', rating: 4.7 },
        { title: 'Unreal Engine', description: 'Videojuegos con Unreal Engine', creationDate: '2024-04-15', rating: 4.6 },
        { title: 'Machine Learning', description: 'Introducción al Machine Learning', creationDate: '2024-05-01', rating: 4.8 },
        { title: 'Data Science', description: 'Ciencia de datos con Python', creationDate: '2024-05-15', rating: 4.7 },
        { title: 'Power BI', description: 'Visualización de datos con Power BI', creationDate: '2024-06-01', rating: 4.5 },
        { title: 'Excel Avanzado', description: 'Automatización y análisis con Excel', creationDate: '2024-06-15', rating: 4.4 },
        { title: 'SCRUM', description: 'Gestión ágil de proyectos con SCRUM', creationDate: '2024-07-01', rating: 4.3 },
        { title: 'Firebase', description: 'Backend para apps móviles con Firebase', creationDate: '2024-07-15', rating: 4.5 },
        { title: 'SASS', description: 'Preprocesadores CSS con SASS', creationDate: '2024-08-01', rating: 4.2 },
        { title: 'Bootstrap', description: 'Framework CSS Bootstrap', creationDate: '2024-08-15', rating: 4.3 }
    ];

    // Referencias a elementos del DOM
    const courseList = document.getElementById('course-list');
    if (courseList) {
        courses.forEach(course => {
            const item = document.createElement('div');
            item.className = 'course-item';
            item.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <span>Fecha: ${course.creationDate}</span>
                <span>Rating: ${course.rating}</span>
            `;
            courseList.appendChild(item);
        });
    }
    const loadMoreBtn = document.getElementById('load-more');
    const sortOptions = document.getElementById('sort-options');

    // Verificación crítica de elementos
    if (!courseList || !loadMoreBtn || !sortOptions) {
        console.error("ERROR: Elementos del DOM no encontrados");
        return;
    }

    // Función para renderizar cursos
    function renderCourses(coursesToRender) {
        courseList.innerHTML = '';
        coursesToRender.forEach(course => {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            courseList.innerHTML += `
                <div class="course-item">
                    <div class="circle" style="background-color: #${randomColor}"></div>
                    <div class="details">
                        <h3>${course.title}</h3>
                        <p>${course.description}</p>
                        <p>Fecha: ${course.creationDate}</p>
                        <p class="rating">★ ${course.rating}</p>
                    </div>
                </div>
            `;
        });
    }

    // Cargar primeros cursos
    renderCourses(courses.slice(0, 10));

    // Evento para ordenar
    sortOptions.addEventListener('change', function (e) {
        const sortedCourses = [...courses];
        const option = e.target.value;

        if (option === 'most-popular') {
            sortedCourses.sort((a, b) => b.rating - a.rating);
        } else if (option === 'least-popular') {
            sortedCourses.sort((a, b) => a.rating - b.rating);
        } else if (option === 'most-recent') {
            sortedCourses.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        } else if (option === 'least-recent') {
            sortedCourses.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
        }

        renderCourses(sortedCourses);
    });

    // Evento para "Mostrar más"
    loadMoreBtn.addEventListener('click', function () {
        const currentCount = document.querySelectorAll('.course-item').length;
        const moreCourses = courses.slice(currentCount, currentCount + 10);
        moreCourses.forEach(course => {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            courseList.innerHTML += `
                <div class="course-item">
                    <div class="circle" style="background-color: #${randomColor}"></div>
                    <div class="details">
                        <h3>${course.title}</h3>
                        <p>${course.description}</p>
                        <p>Fecha: ${course.creationDate}</p>
                        <p class="rating">★ ${course.rating}</p>
                    </div>
                </div>
            `;
        });
    });

    console.log("Script inicializado correctamente");
});
