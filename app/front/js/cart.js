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

                    // Nombre del curso
                    const title = document.createElement('span');
                    title.className = 'cart-title';
                    title.textContent = item.titulo;

                    // Botón eliminar (X)
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-item-btn';
                    removeBtn.title = 'Eliminar del carrito';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.onclick = () => removeItem(usuarioId, item.id);

                    cartItem.appendChild(circle);
                    cartItem.appendChild(title);
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
                // Simula el pago: limpia el carrito y muestra éxito
                simularPago();
            } else {
                yapeError.textContent = 'Código inválido';
                setTimeout(() => {
                    yapeInput.value = '';
                    updateYapeX('');
                    yapeError.textContent = '';
                    yapeInput.focus();
                }, 1200);
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

// Simula el pago: limpia el carrito y muestra éxito
function simularPago() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioId = usuario?.id;
    if (!usuarioId) return;

    // Llama al backend para procesar la compra
    fetch(`http://127.0.0.1:5000/api/comprar`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario_id: usuarioId })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);  // Ver la respuesta completa
        if (data.success) {
            yapeModal.style.display = 'none';
            renderCart();  // Limpia el carrito después de la compra
            alert("¡Pago realizado con éxito! Tus cursos han sido comprados.");
        } else {
            yapeModal.style.display = 'none';
            alert("Ocurrió un error al procesar el pago: " + data.mensaje);
        }
    })
    .catch(() => {
        yapeModal.style.display = 'none';
        alert("Ocurrió un error al procesar el pago.");
    });
}
