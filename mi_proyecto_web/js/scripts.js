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
