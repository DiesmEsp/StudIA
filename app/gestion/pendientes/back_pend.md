# 🔧 Pendientes del backend (API)

Este archivo enumera los endpoints que aún deben implementarse, agrupados por la página del frontend que los utiliza. También puedes utilizar esta lista para asignar tareas entre los desarrolladores backend.

---

## 📥 Endpoints por implementar

| Endpoint                         | Descripción                                      | Página relacionada     |
|----------------------------------|--------------------------------------------------|-------------------------|
| [x] `POST /api/registro`             | Crear nuevo usuario                              | `registro.html`         |
| [x] `POST /api/login`                | Validar credenciales y devolver info del usuario | `inicio_sesion.html`    |
| [ ] `GET /api/cursos`                | Listar todos los cursos                          | `course_list.html`      |
| [ ] `GET /api/compras/{usuario_id}`  | Ver lista de cursos comprados por el usuario     | `course_list.html`      |
| [ ] `GET /api/curso/{id}`            | Obtener detalles de un curso específico          | `course_info.html`      |
| [ ] `POST /api/carrito`              | Agregar un curso al carrito del usuario          | `course_info.html`      |
| [ ] `GET /api/carrito/{usuario_id}`  | Ver el contenido actual del carrito              | `carrito.html`          |
| [ ] `DELETE /api/carrito/{curso_id}` | Eliminar curso del carrito                       | `carrito.html`          |
| [ ] `POST /api/comprar`              | Procesar los cursos del carrito como compra      | `carrito.html`          |

---
