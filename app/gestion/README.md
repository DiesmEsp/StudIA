# 🧭 Guía general del proyecto StudIA

Este proyecto es una plataforma educativa que permite a los usuarios:
- Registrarse e iniciar sesión
- Explorar un catálogo de cursos
- Generar un roadmap personalizado según un tema de interés
- Agregar cursos al carrito y simular compras

Este documento resume las páginas principales de la app y su relación directa con los endpoints definidos en el backend.

---

## 📄 Páginas y su función

| Página               | Función principal                                              | Endpoints relacionados                                                                          |
|----------------------|---------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| `index.html`         | Página de inicio, navegación entre secciones                   | Ninguno directo (solo navegación / carga del header dinámico)                                   |
| `inicio_sesion.html` | Iniciar sesión de usuario                                      | `POST /api/login`                                                                               |
| `registro.html`      | Crear nueva cuenta de usuario                                  | `POST /api/registro`                                                                            |
| `roadmap.html`       | Generar roadmap personalizado según un tema                    | `POST /api/roadmap`                                                                             |
| `course_list.html`   | Ver catálogo general de cursos + filtro de cursos comprados    | `GET /api/cursos` <br> `GET /api/compras/{usuario_id}`                                          |
| `course_info.html`   | Ver detalles de un curso y agregarlo al carrito                | `GET /api/curso/{id}` <br> `POST /api/carrito`                                                  |
| `carrito.html`       | Ver cursos en el carrito, eliminarlos y simular compra         | `GET /api/carrito/{usuario_id}` <br> `DELETE /api/carrito/{curso_id}` <br> `POST /api/comprar` |
| `dashboard.html`     | Panel para administrador (no enlazado, ni necesario por ahora) | *(No se están utilizando endpoints por el momento)*                                             |

---

## 📘 Guías detalladas

Consulta estos documentos si deseas ver con más profundidad cómo funciona cada parte:

- [`guia_paginas.md`](./guias/guia_paginas.md): Explicación detallada del propósito y comportamiento de cada página del frontend.
- [`guia_endpoints.md`](./guias/guia_endpoints.md): Lista completa de endpoints del backend y su relación con el frontend.

---

## 🧩 Pendientes documentados

Aquí encontrarás tareas aún por implementar, separadas por área del proyecto:

- [`frontend_pendientes.md`](./pendientes/front_pend.md): Acciones pendientes del lado del cliente (HTML, JS, integración).
- [`backend_pendientes.md`](./pendientes/back_pend.md): Funcionalidades faltantes del backend (API, controladores, endpoints).

---
