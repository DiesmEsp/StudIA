document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioId = usuario?.id;

    if (!usuarioId) {
        document.getElementById('cart-items').innerHTML = `
            <div style="padding: 30px; text-align: center; color: #888;">
                Debes <a href="inicio_sesion.html">iniciar sesión</a> para ver tu carrito.
            </div>
        `;
        document.getElementById('total-price').textContent = "S/. 0.00";
        document.getElementById('discount-price').textContent = "S/. 0.00";
        document.getElementById('final-total').textContent = "S/. 0.00";
        document.querySelector('.checkout-button').disabled = true;
        return;
    }

    fetch(`http://127.0.0.1:5000/api/carrito/${usuarioId}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                document.getElementById('cart-items').innerHTML = `<div style="padding: 30px; text-align: center; color: #888;">${data.mensaje}</div>`;
                document.querySelector('.checkout-button').disabled = true;
                return;
            }

            const cursos = data.cursos;
            const cartContainer = document.getElementById('cart-items');
            cartContainer.innerHTML = '';

            let subtotal = 0;

            if (cursos.length === 0) {
                cartContainer.innerHTML = `
                    <div style="padding: 30px; text-align: center; color: #888;">
                        Tu carrito está vacío.<br>
                        <a href="course_list.html" style="color:#4CAF50;">Explorar cursos</a>
                    </div>
                `;
                document.querySelector('.checkout-button').disabled = true;
            } else {
                cursos.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');

                    // Circulito de color pastel
                    const circle = document.createElement('div');
                    circle.classList.add('cart-circle');
                    circle.style.backgroundColor = getRandomPastelColor();

                    // Contenedor de texto
                    const textContainer = document.createElement('div');
                    textContainer.className = 'cart-text-container';

                    // Nombre del curso
                    const title = document.createElement('span');
                    title.className = 'cart-title';
                    title.textContent = item.titulo;

                    // Precio del curso
                    const price = document.createElement('span');
                    price.className = 'cart-price';
                    price.textContent = `S/. ${item.precio.toFixed(2)}`;

                    // Botón eliminar (X)
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-item-btn';
                    removeBtn.title = 'Eliminar del carrito';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.onclick = (e) => {
                        e.stopPropagation();
                        showDeleteConfirmation(usuarioId, item.id, item.titulo);
                    };

                    // Estructura
                    textContainer.appendChild(title);
                    textContainer.appendChild(price);
                    cartItem.appendChild(circle);
                    cartItem.appendChild(textContainer);
                    cartItem.appendChild(removeBtn);

                    cartContainer.appendChild(cartItem);

                    subtotal += item.precio;
                });
                document.querySelector('.checkout-button').disabled = false;
            }

            document.getElementById('total-price').textContent = `S/. ${subtotal.toFixed(2)}`;
            document.getElementById('discount-price').textContent = 'S/. 0.00';
            document.getElementById('final-total').textContent = `S/. ${subtotal.toFixed(2)}`;
        })
        .catch(() => {
            document.getElementById('cart-items').innerHTML = `<div style="padding: 30px; text-align: center; color: #888;">Error al cargar el carrito.</div>`;
            document.querySelector('.checkout-button').disabled = true;
        });
}

// Función para mostrar confirmación de eliminación
function showDeleteConfirmation(usuarioId, cursoId, cursoNombre) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>¿Eliminar curso?</h3>
            <p>¿Estás seguro que deseas eliminar <strong>"${cursoNombre}"</strong> de tu carrito?</p>
            <div class="modal-buttons">
                <button class="cancel-btn">Cancelar</button>
                <button class="confirm-btn">Sí, eliminar</button>
            </div>
        </div>
    `;
    
    // Event listeners para los botones
    modal.querySelector('.cancel-btn').onclick = () => modal.remove();
    modal.querySelector('.confirm-btn').onclick = () => {
        modal.remove();
        removeItem(usuarioId, cursoId);
    };
    
    document.body.appendChild(modal);
}

// Elimina un curso del carrito
function removeItem(usuarioId, cursoId) {
    fetch(`http://127.0.0.1:5000/api/carrito/${usuarioId}?curso_id=${cursoId}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            renderCart();
        } else {
            alert(data.mensaje || "No se pudo eliminar el curso del carrito.");
        }
    })
    .catch(() => alert("Error al eliminar el curso del carrito."));
}

// Genera un color pastel aleatorio
function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
}

// --- YAPE PAGO SIMULADO ---
const YAPE_CODES = [
    "123456", "654321", "111222", "333444", "555666",
    "777888", "246810", "135790", "987654", "112233"
];

const yapeModal = document.getElementById('yape-modal');
const yapeForm = document.getElementById('yape-form');
const yapeInput = document.getElementById('yape-code');
const yapeXRow = document.getElementById('yape-x-row');
const yapeError = document.getElementById('yape-error');
const yapeClose = document.getElementById('yape-close');
const checkoutBtn = document.querySelector('.checkout-button');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        yapeModal.style.display = 'flex';
        yapeInput.value = '';
        yapeError.textContent = '';
        updateYapeX('');
        setTimeout(() => yapeInput.focus(), 200);
    });
}

if (yapeClose) {
    yapeClose.onclick = () => {
        yapeModal.style.display = 'none';
        yapeInput.value = '';
        yapeError.textContent = '';
        updateYapeX('');
    };
}

if (yapeForm) {
    yapeForm.addEventListener('submit', e => e.preventDefault());
}

if (yapeInput) {
    yapeInput.addEventListener('input', function () {
        let val = this.value.replace(/\D/g, '').slice(0, 6);
        this.value = val;
        updateYapeX(val);

        if (val.length === 6) {
            if (YAPE_CODES.includes(val)) {
                yapeError.textContent = '';
                simularPago();
            } else {
                // Cerrar modal de Yape primero
                yapeModal.style.display = 'none';
                yapeInput.value = '';
                updateYapeX('');
                
                // Mostrar procesamiento
                showProcessingModal();
                
                // Después de 5 segundos, volver a mostrar Yape con error
                setTimeout(() => {
                    hideProcessingModal();
                    yapeModal.style.display = 'flex';
                    yapeError.textContent = 'Código inválido. Por favor, intente con otro.';
                    yapeInput.focus();
                }, 5000);
            }
        }
    });
}

function updateYapeX(val) {
    const xs = yapeXRow.querySelectorAll('.yape-x');
    for (let i = 0; i < 6; i++) {
        xs[i].textContent = val[i] ? val[i] : 'X';
        xs[i].classList.toggle('filled', !!val[i]);
    }
}

// Función mejorada para simular pago
function simularPago() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) return;

    // 1. Cerrar el modal de Yape primero
    if (yapeModal) yapeModal.style.display = 'none';
    
    // 2. Mostrar modal de procesamiento
    showProcessingModal();
    
    // 3. Simular procesamiento durante 5 segundos
    setTimeout(() => {
        // Ocultar modal de procesamiento
        hideProcessingModal();
        
        // Procesar el pago con el backend
        fetch(`http://127.0.0.1:5000/api/comprar`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Mostrar éxito después del procesamiento
                showSuccessModal();
                renderCart();
            } else {
                // Mostrar error y volver a Yape
                yapeModal.style.display = 'flex';
                yapeError.textContent = data.mensaje || "Error al procesar el pago";
                yapeInput.value = '';
                updateYapeX('');
                yapeInput.focus();
            }
        })
        .catch(error => {
            // Mostrar error y volver a Yape
            yapeModal.style.display = 'flex';
            yapeError.textContent = "Error de conexión con el servidor";
            yapeInput.value = '';
            updateYapeX('');
            yapeInput.focus();
        });
    }, 5000); // 5 segundos de espera
}

// Modal de procesamiento
function showProcessingModal() {
    const modal = document.createElement('div');
    modal.className = 'processing-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="spinner"></div>
            <h3>Procesando tu pago...</h3>
            <p>Por favor espera unos momentos</p>
        </div>
    `;
    document.body.appendChild(modal);
}

function hideProcessingModal() {
    const modal = document.querySelector('.processing-modal');
    if (modal) modal.remove();
}

// Modal de éxito
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">🎉</div>
            <h3>¡Pago exitoso!</h3>
            <p>Tus cursos han sido comprados correctamente.</p>
            <button onclick="this.closest('.success-modal').remove()">Aceptar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Modal de error
function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="error-icon">⚠️</div>
            <h3>Error en el pago</h3>
            <p>${message}</p>
            <button onclick="this.closest('.error-modal').remove()">Aceptar</button>
        </div>
    `;
    document.body.appendChild(modal);
}