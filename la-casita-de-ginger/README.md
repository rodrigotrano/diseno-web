# La Casita de Ginger

Sitio web para **La Casita de Ginger**, pastelería temática de Chillán donde la Navidad se vive todo el año.
Proyecto desarrollado de forma individual (con autorización de la docente) en la asignatura Diseño Web de IPLACEX, a partir de los antecedentes entregados por el emprendimiento.

🔗 **Sitio publicado:** [URL_NETLIFY](URL_NETLIFY)

## Páginas
| Página | Contenido |
|---|---|
| Inicio (`index.html`) | Portada de bienvenida, menú y redes sociales |
| Nosotros (`nosotros.html`) | Historia del emprendimiento, misión y visión |
| Productos (`productos.html`) | Carta de tortas, galletas y pastelería con visor de imágenes |
| Pedido (`pedido.html`) | Formulario de pedido con carrito, total y envío por WhatsApp |
| Contacto (`contacto.html`) | Horario, ubicación, redes y formulario de comentarios |
| `plantilla-base.html` | Página base reutilizable para crear nuevas secciones (no aparece en el menú) |

## Funcionalidades con JavaScript
- **Carrito del pedido** (`js/pedido.js`): al marcar productos y cantidades se arma un resumen con el total de unidades; solo se envían los productos seleccionados.
- **Validación del formulario**: nombre, correo, celular chileno y fecha (no anterior a hoy), con mensajes junto a cada campo (`blur`, `input`, `submit`).
- **Pedido por WhatsApp**: al enviar, se genera el mensaje con el detalle y se abre WhatsApp.
- **Horario «Abierto ahora»** (`js/horario.js`): destaca el día actual e indica si el local está abierto.
- **Comentarios** (`js/comentario.js`): contador de caracteres, validación y vista previa del comentario.

## Estructura (organizada como plantilla)
```
examen-final/public_html/
├── index.html, nosotros.html, productos.html, pedido.html, contacto.html
├── plantilla-base.html
├── css/
│   ├── base.css         variables (colores, fuentes, radios), estilos generales y encabezado
│   ├── estructura.css   menú, redes y pie de página
│   ├── paginas.css      estilos propios de cada página
│   ├── componentes.css  tarjetas, formularios, visor, horario, etc.
│   └── responsive.css   media queries (celular y tablet)
├── js/
│   ├── pedido.js
│   ├── horario.js
│   └── comentario.js
└── img/                 imágenes optimizadas (JPG/WebP)
```

## Historial de evaluaciones
| Carpeta | Evaluación | Contenido |
|---|---|---|
| [`ev1-html/`](ev1-html/public_html/index.html) | N°1 – Fundamentos de desarrollo web | Estructura semántica en HTML, sin CSS |
| [`ev2-css/`](ev2-css/public_html/index.html) | N°2 – Diseño web y CSS | Hoja de estilos externa, Flexbox/Grid, animaciones y página de pedidos |
| [`ev3-js/`](ev3-js/public_html/index.html) | N°3 – Introducción a JavaScript | Diseño propio organizado como plantilla, con JavaScript y eventos |
| [`examen-final/`](examen-final/public_html/index.html) | Examen final | Versión definitiva, publicada en Netlify |

## Tecnologías
- HTML5 semántico (validado en W3C)
- CSS3 con variables, Flexbox, Grid, animaciones y media queries
- JavaScript: manipulación del DOM y eventos (`DOMContentLoaded`, `click`, `change`, `input`, `blur`, `submit`, `reset`)
- Git y GitHub para el control de versiones; Netlify para la publicación

## Cómo verlo en local
Descarga el repositorio y abre `examen-final/public_html/index.html` en el navegador.

---
Diseñado y desarrollado por **Rodrigo Tranolao**.
