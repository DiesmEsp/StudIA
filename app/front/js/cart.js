// Datos de ejemplo para los cursos en el carrito
let cartItems = [
    { id: 1, title: 'Introducción a JAVA', price: 30.00 },
    { id: 2, title: 'CSS Básico', price: 25.00 },
    { id: 3, title: 'JavaScript Intermedio', price: 35.00 },
    { id: 4, title: 'HTML para Todos', price: 20.00 },
    { id: 5, title: 'C++ Intermedio', price: 40.00 },
];

// Genera un color pastel aleatorio
function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
}

// Renderiza los cursos en el carrito
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    let subtotal = 0;

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        // Circulito de color pastel
        const circle = document.createElement('div');
        circle.classList.add('cart-circle');
        circle.style.backgroundColor = getRandomPastelColor();

        // Nombre del curso
        const title = document.createElement('span');
        title.className = 'cart-title';
        title.textContent = item.title;

        // Botón eliminar (X)
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item-btn';
        removeBtn.title = 'Eliminar del carrito';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeItem(item.id);

        cartItem.appendChild(circle);
        cartItem.appendChild(title);
        cartItem.appendChild(removeBtn);

        cartContainer.appendChild(cartItem);

        subtotal += item.price;
    });

    // Actualizar resumen
    document.getElementById('total-price').textContent = `S/. ${subtotal.toFixed(2)}`;
    document.getElementById('discount-price').textContent = 'S/. 0.00';
    document.getElementById('final-total').textContent = `S/. ${subtotal.toFixed(2)}`;

    // Habilita/deshabilita el botón de pago
    const checkoutBtn = document.querySelector('.checkout-button');
    checkoutBtn.disabled = cartItems.length === 0;
}

// Elimina un curso del carrito
function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCart();
}

// Renderiza al cargar
document.addEventListener('DOMContentLoaded', renderCart);