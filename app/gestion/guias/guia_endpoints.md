# 📡 Guía de endpoints del proyecto

Este documento resume los endpoints disponibles y en qué parte del frontend son utilizados.

---

| Endpoint                             | Descripción                                      | Página relacionada   |
|--------------------------------------|--------------------------------------------------|------------------------|
| `POST /api/registro`                 | Crear nuevo usuario                              | `registro.html`        |
| `POST /api/login`                    | Validar credenciales y devolver info del usuario | `inicio_sesion.html`   |
| `GET /api/cursos`                    | Listar todos los cursos                          | `course_list.html`     |
| `GET /api/compras/{usuario_id}`      | Ver lista de cursos comprados por el usuario     | `course_list.html`     |
| `GET /api/curso/{id}`                | Obtener detalles de un curso específico          | `course_info.html`     |
| `POST /api/carrito`                  | Agregar un curso al carrito del usuario          | `course_info.html`     |
| `GET /api/carrito/{usuario_id}`      | Ver el contenido actual del carrito              | `carrito.html`         |
| `DELETE /api/carrito/{curso_id}`     | Eliminar curso del carrito                       | `carrito.html`         |
| `POST /api/comprar`                  | Procesar los cursos del carrito como compra      | `carrito.html`         |
| `POST /api/roadmap`                  | Generar roadmap según tema                       | `roadmap.html` ✅       |

---
