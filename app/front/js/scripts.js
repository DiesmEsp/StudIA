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
// const addToCartBtn = document.getElementById("add-to-cart");
// if (addToCartBtn) {
//     addToCartBtn.dataset.price = addToCartBtn.textContent;
//     addToCartBtn.addEventListener("mouseover", function () {
//         this.textContent = "Añadir al Carrito";
//     });
//     addToCartBtn.addEventListener("mouseout", function () {
//         this.textContent = this.dataset.price;
//     });
// }

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
            <p><b>😢 Lo sentimos 😢</b><br><br>Este curso no tiene un sílabus<br>disponible por el momento.</p>
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
    if (document.getElementById('course-list-page')) {
        // Obtener usuario del localStorage
        const user = JSON.parse(localStorage.getItem("usuario"));
        const userId = user?.id || null;

        // Selección de elementos del DOM
        const courseList = document.getElementById('course-list');
        const loadMoreBtn = document.getElementById('load-more');
        const sortOptions = document.getElementById('sort-options');
        const filterComprados = document.getElementById('filter-comprados');
        const searchInput = document.getElementById('course-search');

        // Verificación de elementos del DOM
        if (!courseList || !loadMoreBtn || !sortOptions || !filterComprados || !searchInput) {
            console.error("ERROR: Elementos del DOM no encontrados", {
                courseList: !courseList,
                loadMoreBtn: !loadMoreBtn,
                sortOptions: !sortOptions,
                filterComprados: !filterComprados,
                searchInput: !searchInput
            });
            return;
        }

        // Estado de la aplicación
        let allCourses = [];
        let currentCourses = [];
        let displayedCourses = [];
        let currentSort = 'most-popular';
        let currentFilter = false;
        let currentSearchTerm = '';
        let renderedCount = 0;
        const coursesPerPage = 10;

        // Función debounce para mejor performance
        function debounce(func, timeout = 300) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => { func.apply(this, args); }, timeout);
            };
        }

        // Función para aplicar filtros (búsqueda + filtro comprados)
        function applyFilters() {
            let filtered = currentFilter 
                ? allCourses.filter(curso => curso.comprado) 
                : [...allCourses];
            
            // Aplicar filtro de búsqueda si hay término
            if (currentSearchTerm) {
                filtered = filtered.filter(curso => {
                    const titulo = curso.titulo?.toLowerCase() || '';
                    const descripcion = curso.descripcion?.toLowerCase() || '';
                    const nivel = curso.nivel?.toLowerCase() || '';
                    
                    return titulo.includes(currentSearchTerm) || 
                           descripcion.includes(currentSearchTerm) ||
                           nivel.includes(currentSearchTerm);
                });
            }
            
            console.log("Cursos filtrados:", filtered.length); // Debug
            return filtered;
        }

        // Función para aplicar ordenamiento
        function applySort(courses) {
            const sorted = [...courses];
            
            switch(currentSort) {
                case 'most-popular':
                    return sorted.sort((a, b) => (b.rating_promedio || 0) - (a.rating_promedio || 0));
                case 'least-popular':
                    return sorted.sort((a, b) => (a.rating_promedio || 0) - (b.rating_promedio || 0));
                case 'most-recent':
                    return sorted.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
                case 'least-recent':
                    return sorted.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
                default:
                    return sorted;
            }
        }

        // Función para renderizar cursos
        function renderCourses(coursesToRender) {
            // Mostrar mensaje si no hay resultados
            if (coursesToRender.length === 0) {
                courseList.innerHTML = '<p class="no-results">No se encontraron cursos que coincidan con tu búsqueda</p>';
                return;
            }

            courseList.innerHTML = '';
            
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

            // Actualizar estado del botón "Mostrar más"
            loadMoreBtn.disabled = renderedCount >= currentCourses.length;
        }

        // Función para cargar más cursos (paginación)
        function loadMoreCourses() {
            const nextCourses = currentCourses.slice(renderedCount, renderedCount + coursesPerPage);
            displayedCourses = [...displayedCourses, ...nextCourses];
            renderedCount += nextCourses.length;
            renderCourses(displayedCourses);
        }

        // Función principal para actualizar la vista
        function updateCourses(resetPagination = true) {
            console.log("Actualizando cursos con:", {
                search: currentSearchTerm,
                filter: currentFilter,
                sort: currentSort
            });
            
            // Aplicar filtros y ordenamiento
            currentCourses = applySort(applyFilters());
            
            // Reiniciar paginación si es necesario
            if (resetPagination) {
                renderedCount = 0;
                displayedCourses = [];
            }
            
            // Cargar la primera página
            loadMoreCourses();
        }

        // Cargar cursos iniciales desde la API
        let url = 'http://localhost:5000/api/cursos';
        if (userId) url += `?usuario_id=${userId}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success && Array.isArray(data.cursos)) {
                allCourses = data.cursos;
                console.log("Cursos cargados:", allCourses.length); // Debug
                updateCourses(); // Renderizar inicialmente

                // Event listener para la barra de búsqueda
                searchInput.addEventListener('input', debounce(function(e) {
                    currentSearchTerm = e.target.value.toLowerCase().trim();
                    console.log("Búsqueda cambiada a:", currentSearchTerm);
                    updateCourses(true);
                }, 300));

            } else {
                console.error("Error al cargar cursos:", data);
                alert("No se pudieron cargar los cursos.");
                return;
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error al conectar con el servidor.");
            return;
        }

        // Event listeners
        filterComprados.addEventListener('change', function() {
            currentFilter = this.checked;
            console.log("Filtro comprados:", currentFilter);
            updateCourses(true);
        });

        sortOptions.addEventListener('change', function(e) {
            currentSort = e.target.value;
            console.log("Orden cambiado a:", currentSort);
            updateCourses(true);
        });

        loadMoreBtn.addEventListener('click', function() {
            console.log("Cargando más cursos...");
            loadMoreCourses();
        });
    }
});