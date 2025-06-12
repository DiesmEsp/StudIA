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
