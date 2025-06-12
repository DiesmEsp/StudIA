// Validación de formulario en la página de inicio de sesión
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    // Validación simple (puedes agregar más validaciones aquí)
    if(email && password) {
        alert("Formulario enviado con éxito!");
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Actualiza el valor de presupuesto cuando se mueve la barra
function updateBudgetValue() {
    var budget = document.getElementById('budget').value;
    document.getElementById('budget-value').textContent = parseFloat(budget).toFixed(2);
}

// Mostrar campo de detalles cuando se selecciona "Soy Nuevo"
document.getElementById('new').addEventListener('change', function() {
    var detailsField = document.getElementById('knowledge-details');
    if (this.checked) {
        detailsField.style.display = 'block';
    } else {
        detailsField.style.display = 'none';
    }
});

// Función para cambiar el texto del botón al pasar el puntero por encima
document.getElementById("add-to-cart").addEventListener("mouseover", function() {
    this.textContent = "Añadir al Carrito";
});

document.getElementById("add-to-cart").addEventListener("mouseout", function() {
    this.textContent = "S/. 0.00"; // Este valor cambiaría si el JSON devuelve el precio
});

// Mostrar información del curso y cargar el contenido dinámicamente
function loadCourseData(courseData) {
    const courseImage = courseData.image || "images/img4.png";
    const coursePrice = courseData.price ? `S/. ${courseData.price.toFixed(2)}` : "S/. 0.00";
    const courseName = courseData.name || "Nombre del Curso";
    const courseDescription = courseData.description || "[descripción]";
    const pdfLink = courseData.pdf || null;

    // Asignar datos al DOM
    document.getElementById("course-img").src = courseImage;
    document.getElementById("add-to-cart").textContent = coursePrice;
    document.getElementById("course-name").textContent = courseName;
    document.getElementById("course-description").textContent = courseDescription;

    // Configuración del botón PDF
    if (pdfLink) {
        document.getElementById("pdf-btn").onclick = function() {
            window.open(pdfLink, '_blank');
        };
    } else {
        // Mostrar ventana emergente si no hay enlace al PDF
        document.getElementById("pdf-btn").onclick = function() {
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
loadCourseData({
    image: "images/sample-course.png",  // Reemplazar con la imagen real
    price: 99.99,
    name: "Curso de Ejemplo",
    description: "Este curso es sobre ejemplo para mostrar cómo cargar información.",
    pdf: null // No hay enlace al PDF en este caso
});
