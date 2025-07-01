const cursos = [
    {
        id: 1,
        titulo: "Introducción a JavaScript",
        descripcion: "Aprende los fundamentos de JavaScript desde cero",
        nivel: "principiante",
        duracion: 20,
        precio: 99.99
    },
    {
        id: 2,
        titulo: "Python Avanzado",
        descripcion: "Domina las características avanzadas de Python",
        nivel: "avanzado",
        duracion: 40,
        precio: 149.99
    },
    {
        id: 3,
        titulo: "Desarrollo Web Intermedio",
        descripcion: "HTML5, CSS3 y JavaScript moderno",
        nivel: "intermedio",
        duracion: 30,
        precio: 129.99
    }
];

// Función para mostrar los cursos
function mostrarCursos(cursos) {
    const courseList = document.querySelector('.course-list');
    courseList.innerHTML = '';

    cursos.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
                    <span class="course-badge badge-${curso.nivel}">${curso.nivel}</span>
                    <h3 class="course-title">${curso.titulo}</h3>
                    <div class="course-info">Duración: ${curso.duracion} horas</div>
                    <div class="course-info">Precio: S/ ${curso.precio}</div>
                    <div class="edit-buttons">
                        <button class="edit-btn" onclick="editarCurso(${curso.id})">Editar</button>
                        <button class="delete-btn" onclick="eliminarCurso(${curso.id})">Eliminar</button>
                    </div>
                `;
        courseList.appendChild(card);
    });
}

// Función para editar curso
function editarCurso(id) {
    const curso = cursos.find(c => c.id === id);
    const modal = document.getElementById('editModal');

    // Llenar el formulario con los datos del curso
    document.getElementById('titulo').value = curso.titulo;
    document.getElementById('descripcion').value = curso.descripcion;
    document.getElementById('nivel').value = curso.nivel;
    document.getElementById('duracion').value = curso.duracion;
    document.getElementById('precio').value = curso.precio;

    modal.classList.add('active');
}

// Función para eliminar curso
function eliminarCurso(id) {
    if(confirm('¿Estás seguro de que deseas eliminar este curso?')) {
        // Aquí iría la lógica para eliminar el curso
        console.log(`Eliminando curso ${id}`);
    }
}

// Cerrar modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('editModal').classList.remove('active');
});

// Búsqueda de cursos
document.querySelector('.search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cursosFiltrados = cursos.filter(curso =>
        curso.titulo.toLowerCase().includes(searchTerm) ||
        curso.descripcion.toLowerCase().includes(searchTerm)
    );
    mostrarCursos(cursosFiltrados);
});

// Manejar el envío del formulario
document.getElementById('editCourseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    alert('Cambios guardados exitosamente');
    document.getElementById('editModal').classList.remove('active');
});

// Cargar cursos al iniciar
mostrarCursos(cursos);
