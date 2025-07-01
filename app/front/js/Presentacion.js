document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.objetivo-card');
    const imagenDestacada = document.getElementById('imagen-destacada');

    // Establecer la primera tarjeta como activa por defecto
    cards[0].classList.add('active');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Remover la clase active de todas las tarjetas
            cards.forEach(c => c.classList.remove('active'));

            // Agregar la clase active a la tarjeta clickeada
            this.classList.add('active');

            // Cambiar la imagen
            const nuevaImagen = this.getAttribute('data-image');

            // Agregamos una animación de fade
            imagenDestacada.style.opacity = '0';

            setTimeout(() => {
                imagenDestacada.src = nuevaImagen;
                imagenDestacada.style.opacity = '1';
            }, 300);
        });
    });
});
