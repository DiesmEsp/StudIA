document.addEventListener("DOMContentLoaded", () => {
    fetch("/header/header.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("shared-header").innerHTML = html;

            const contenedor = document.getElementById("usuario-info");
            const datos = JSON.parse(localStorage.getItem("usuario"));

            if (datos && datos.nombre) {
                contenedor.innerHTML = `
                    <div class="usuario-bienvenida">
                        <span>👋 ¡Hola, <strong>${datos.nombre}</strong>!</span>
                        <button id="cerrarSesionBtn" class="logout-btn" title="Cerrar sesión">🚪</button>
                    </div>
                `;

                document.getElementById("cerrarSesionBtn").addEventListener("click", () => {
                    if (confirm("¿Cerrar sesión?")) {
                        localStorage.removeItem("usuario");
                        location.reload();
                    }
                });
            } else {
                contenedor.innerHTML = `
                    <a href="/inicio_sesion.html">
                        <button class="access-button">Acceder</button>
                    </a>
                `;
            }
        });
});
