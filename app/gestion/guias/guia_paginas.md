# 🗂️ Guía detallada de páginas

Este documento describe brevemente el propósito de cada una de las páginas del frontend.

---

## 🏠 1. index.html (Página principal)

- Punto de entrada de la aplicación.
- Muestra enlaces a otras secciones: cursos, login, roadmap, etc.
- Incluye un header dinámico con login/logout y el nombre del usuario si está autenticado.

---

## 🔑 2. inicio_sesion.html (Inicio de sesión)

- Formulario de login para que el usuario acceda con su cuenta.

---

## 📝 3. registro.html (Registro de usuario)

- Formulario para crear una nueva cuenta con nombre, email y contraseña.

---

## 🧠 4. roadmap.html (Generador de roadmap)

- El usuario ingresa un tema o palabra clave.
- La página genera un roadmap visual o lista ordenada de cursos recomendados.
- Utiliza el endpoint: `POST /api/roadmap`.

---

## 📚 5. course_list.html (Listado general de cursos)

- Muestra todos los cursos disponibles en la plataforma.
- Filtros aplicados en el frontend (nivel, duración, etc.).
- Checkbox opcional para ver solo los cursos comprados por el usuario.

---

## 📘 6. course_info.html (Detalles de un curso)

- Página para ver detalles de un curso (título, descripción, duración, etc.).
- Botón “Agregar al carrito”.
- Si el usuario no está autenticado, se redirige a la página de login.

---

## 🛒 7. carrito.html (Carrito de compras)

- Muestra los cursos agregados por el usuario.
- Permite eliminar cursos del carrito.
- Botón “Comprar” que simula un pago y limpia el carrito.

---

## 🧑‍💼 8. dashboard.html (Panel administrativo)

- Panel para administración (por implementar).
- No enlazado desde otras páginas actualmente.
