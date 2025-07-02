# 🧩 Pendientes del frontend

Lista priorizada de tareas de implementación en el frontend. Puedes marcar las tareas completadas con `[x]`.

---

## 🔧 Tareas generales

- [x] Interconectar páginas  
  Asegurarse de que todos los enlaces entre páginas funcionen correctamente.

- [x] Crear `header.js` reutilizable  
  Centralizar lógica de login/logout, nombre del usuario y visibilidad de elementos como el carrito.

- [x] Adaptar header según login  
  Mostrar nombre del usuario y botón “Cerrar sesión” si está autenticado.

- [x] Mostrar/ocultar botón del carrito  
  Solo mostrar el ícono si el usuario está logueado.

- [x] Agregar botón “Cerrar sesión”  
  Eliminar datos del `localStorage` y redirigir al inicio.

- [x] Control de acceso  
  Redirigir a login si el usuario intenta usar funciones como agregar al carrito o comprar sin sesión activa.

---

## 📄 Pendientes por página

| Página               | Endpoints utilizados                                      | Pendientes en frontend                                                                                                                                                  |
|----------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `index.html`         | —                                                         | [x] **CREAR LA PÁGINA** <br> [x] Mostrar navegación principal                                                                                                           |
| `inicio_sesion.html` | `POST /api/login`                                         | [x] Conectar formulario a API <br> [x] Guardar usuario en `localStorage` <br> [x] Redirigir a `index.html` tras login                                                  |
| `registro.html`      | `POST /api/registro`                                      | [x] Conectar formulario a API <br> [x] Mostrar mensaje <br> [x] Redirigir a `inicio_sesion.html` tras éxito                                                                   |
| `roadmap.html`       | `POST /api/roadmap`                                       | [x] Ya funcional <br> [x] (Opcional) Hacer nodos clicables para abrir curso                                                      |
| `course_list.html`   | `GET /api/cursos` <br> `GET /api/compras/{usuario_id}`    | [x] Checkbox “Ver solo mis cursos” <br> [x] Filtros en frontend <br> [x] Marcar cursos comprados                                                                      |
| `course_info.html`   | `GET /api/curso/{id}` <br> `POST /api/carrito`            | [x] Botón “Agregar al carrito” <br> [x] Redirigir a login si no hay sesión                                                       |
| `carrito.html`       | `GET /api/carrito/{usuario_id}` <br> `DELETE` <br> `POST` | [x] **CREAR LA PÁGINA** <br> [x] Mostrar cursos <br> [x] Botón “Eliminar curso” <br> [x] Botón “Comprar” con simulación                                               |
| `dashboard.html`     | *(endpoint por definir)*                                  | [x] **CREAR LA PÁGINA** <br> [x] Definir qué mostrar (cursos, usuarios, etc.) <br> [ ] Crear endpoint para alimentarlo                                        |
