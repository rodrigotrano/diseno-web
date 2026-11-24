/* =====================================================================
   La Casita de Ginger · pedido.js
   Funcionalidades de la página "Haz tu pedido":
     1. Carrito: resumen con productos, unidades y total estimado.
     2. Validación del formulario campo por campo (blur) y al enviar (submit).
     3. Pedido por WhatsApp: arma el mensaje con todo el pedido.
   Autor: Rodrigo Tranolao · Diseño Web · Evaluación N°3
   ===================================================================== */

// Número de WhatsApp de La Casita de Ginger
const WHATSAPP = '56952281744';

// El código se ejecuta cuando el HTML ya está cargado
document.addEventListener('DOMContentLoaded', function () {

    // ---------- Elementos de la página (DOM) ----------
    const formulario   = document.getElementById('form-pedido');
    const resumen      = document.getElementById('resumen');
    const confirmacion = document.getElementById('confirmacion');
    const contadorCss  = document.querySelector('.resumen-pedido');
    const items        = document.querySelectorAll('.item');

    const campos = {
        nombre:   document.getElementById('nombre'),
        correo:   document.getElementById('correo'),
        telefono: document.getElementById('telefono'),
        fecha:    document.getElementById('fecha')
    };

    // JavaScript toma el control: se oculta el contador de CSS y se muestra el resumen
    formulario.classList.add('js-activo');
    formulario.setAttribute('novalidate', '');   // los mensajes de error los muestra JavaScript
    contadorCss.hidden = true;
    resumen.hidden = false;

    // La fecha mínima es hoy (no se puede pedir para un día que ya pasó)
    campos.fecha.min = fechaHoy();


    /* ================= 1. CARRITO ================= */

    // Recorre los productos y devuelve solo los que están marcados
    function leerCarrito() {
        const carrito = [];

        items.forEach(function (item) {
            const casilla = item.querySelector('.agregar');
            if (!casilla.checked) {
                return;                              // producto no marcado: se ignora
            }

            const nombre = item.querySelector('.item-info strong').textContent;
            const lineas = [];
            let unidades = 0;
            let subtotal = 0;
            let sinPrecio = false;

            item.querySelectorAll('.item-cantidad input').forEach(function (campo) {
                const cantidad = parseInt(campo.value, 10) || 0;
                if (cantidad <= 0) {
                    return;
                }
                // El texto de la etiqueta ("20 personas" o "Cantidad") describe la opción
                const opcion = campo.parentElement.textContent.trim();
                if (opcion === 'Cantidad') {
                    lineas.push(cantidad + plural(cantidad, ' unidad', ' unidades'));
                } else {
                    lineas.push(cantidad + plural(cantidad, ' torta', ' tortas') + ' de ' + opcion);
                }
                unidades += cantidad;

                if (campo.dataset.precio) {
                    subtotal += cantidad * Number(campo.dataset.precio);
                } else {
                    sinPrecio = true;                // precio a cotizar
                }
            });

            carrito.push({ nombre: nombre, lineas: lineas, unidades: unidades,
                           subtotal: subtotal, sinPrecio: sinPrecio });
        });

        return carrito;
    }

    // Los campos de cantidad de productos NO marcados se desactivan (disabled):
    // así el formulario solo envía las cantidades de lo que se eligió
    function sincronizarCantidades() {
        items.forEach(function (item) {
            const marcado = item.querySelector('.agregar').checked;
            item.querySelectorAll('.item-cantidad input').forEach(function (campo) {
                campo.disabled = !marcado;
            });
        });
    }

    // Dibuja el resumen del carrito dentro de <div id="resumen">
    function mostrarResumen() {
        sincronizarCantidades();
        const carrito = leerCarrito();
        resumen.innerHTML = '';                      // se limpia el contenido anterior

        if (carrito.length === 0) {
            const vacio = document.createElement('p');
            vacio.className = 'resumen-vacio';
            vacio.textContent = 'Aún no has agregado productos. Presiona + en los que quieras.';
            resumen.appendChild(vacio);
            return;
        }

        let totalUnidades = 0;
        let total = 0;
        let hayCotizar = false;

        const lista = document.createElement('ul');
        carrito.forEach(function (producto) {
            const fila = document.createElement('li');
            const nombre = document.createElement('strong');
            nombre.textContent = producto.nombre;
            fila.appendChild(nombre);

            const detalle = document.createElement('span');
            if (producto.unidades === 0) {
                detalle.textContent = 'Indica una cantidad';
                fila.classList.add('sin-cantidad');
            } else {
                detalle.textContent = producto.lineas.join(' · ');
            }
            fila.appendChild(detalle);
            lista.appendChild(fila);

            totalUnidades += producto.unidades;
            total += producto.subtotal;
            if (producto.sinPrecio && producto.unidades > 0) {
                hayCotizar = true;
            }
        });

        const titulo = document.createElement('p');
        titulo.className = 'resumen-titulo';
        titulo.textContent = 'Tu pedido: ' + carrito.length + plural(carrito.length, ' producto', ' productos') +
                             ' · ' + totalUnidades + plural(totalUnidades, ' unidad', ' unidades');

        resumen.appendChild(titulo);
        resumen.appendChild(lista);

        if (total > 0) {
            const totalTexto = document.createElement('p');
            totalTexto.className = 'resumen-total';
            totalTexto.textContent = 'Total estimado: ' + formatoPesos(total) +
                                     (hayCotizar ? ' + productos a cotizar' : '');
            resumen.appendChild(totalTexto);
        } else if (hayCotizar) {
            const cotizar = document.createElement('p');
            cotizar.className = 'resumen-total';
            cotizar.textContent = 'Ginger te enviará el precio de tu pedido.';
            resumen.appendChild(cotizar);
        }
    }

    // Eventos del carrito: marcar un producto (change) o cambiar una cantidad (input)
    formulario.addEventListener('change', function (evento) {
        if (evento.target.matches('.agregar, .item-cantidad input')) {
            mostrarResumen();
        }
    });
    formulario.addEventListener('input', function (evento) {
        if (evento.target.matches('.item-cantidad input')) {
            mostrarResumen();
        }
    });


    /* ================= 2. VALIDACIÓN ================= */

    // Reglas: cada función devuelve el mensaje de error, o '' si el valor es correcto
    const reglas = {
        nombre: function (valor) {
            if (valor === '') return 'Escribe tu nombre.';
            if (valor.length < 3) return 'El nombre debe tener al menos 3 letras.';
            return '';
        },
        correo: function (valor) {
            if (valor === '') return 'Escribe tu correo electrónico.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'El correo no es válido (ejemplo: nombre@correo.com).';
            return '';
        },
        telefono: function (valor) {
            if (valor === '') return '';             // el teléfono es opcional
            const numeros = valor.replace(/[\s+-]/g, '');
            if (!/^(56)?9\d{8}$/.test(numeros)) return 'Usa un celular chileno: +56 9 1234 5678.';
            return '';
        },
        fecha: function (valor) {
            if (valor === '') return 'Elige la fecha en que necesitas tu pedido.';
            if (valor < fechaHoy()) return 'La fecha no puede ser anterior a hoy.';
            return '';
        }
    };

    // Valida un campo y muestra u oculta su mensaje de error debajo
    function validarCampo(id) {
        const campo = campos[id];
        const mensaje = reglas[id](campo.value.trim());
        let error = document.getElementById('error-' + id);

        if (mensaje) {
            if (!error) {
                error = document.createElement('small');
                error.id = 'error-' + id;
                error.className = 'error';
                campo.insertAdjacentElement('afterend', error);
                campo.setAttribute('aria-describedby', error.id);
            }
            error.textContent = mensaje;
            campo.classList.add('campo-invalido');
            campo.setAttribute('aria-invalid', 'true');
            return false;
        }

        if (error) {
            error.remove();
            campo.removeAttribute('aria-describedby');
        }
        campo.classList.remove('campo-invalido');
        campo.removeAttribute('aria-invalid');
        return true;
    }

    // Evento blur: se valida cuando la persona sale del campo
    Object.keys(campos).forEach(function (id) {
        campos[id].addEventListener('blur', function () {
            validarCampo(id);
        });
        // Mientras corrige un campo con error, el mensaje se actualiza al escribir
        campos[id].addEventListener('input', function () {
            if (campos[id].classList.contains('campo-invalido')) {
                validarCampo(id);
            }
        });
    });

    // Revisa que el carrito tenga al menos un producto con cantidad
    function validarCarrito(carrito) {
        const avisoAnterior = document.getElementById('error-carrito');
        if (avisoAnterior) avisoAnterior.remove();

        let mensaje = '';
        if (carrito.length === 0) {
            mensaje = 'Agrega al menos un producto a tu pedido.';
        } else if (carrito.some(function (p) { return p.unidades === 0; })) {
            mensaje = 'Hay productos marcados sin cantidad. Indica cuántos quieres o quítalos.';
        }

        if (mensaje) {
            const aviso = document.createElement('p');
            aviso.id = 'error-carrito';
            aviso.className = 'error';
            aviso.textContent = mensaje;
            resumen.insertAdjacentElement('afterend', aviso);
            return false;
        }
        return true;
    }


    /* ================= 3. ENVÍO POR WHATSAPP ================= */

    // Evento submit: se valida todo antes de enviar
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();                     // el pedido no se envía por correo

        let primerError = null;
        Object.keys(campos).forEach(function (id) {
            if (!validarCampo(id) && !primerError) {
                primerError = campos[id];
            }
        });

        const carrito = leerCarrito();
        const carritoOk = validarCarrito(carrito);

        if (primerError) {
            primerError.focus();                     // lleva a la persona al primer error
            return;
        }
        if (!carritoOk) {
            document.getElementById('error-carrito').scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        mostrarConfirmacion(carrito);
    });

    // Arma el mensaje para WhatsApp y muestra la confirmación con el botón para enviarlo
    function mostrarConfirmacion(carrito) {
        const medios = [];
        formulario.querySelectorAll('input[name="medio_contacto"]:checked').forEach(function (casilla) {
            medios.push(casilla.nextElementSibling.textContent);
        });

        let texto = '¡Hola Ginger! Quiero hacer un pedido:\n\n';
        carrito.forEach(function (producto) {
            texto += '• ' + producto.nombre + ': ' + producto.lineas.join(', ') + '\n';
        });
        texto += '\nFecha: ' + formatoFecha(campos.fecha.value);
        texto += '\nNombre: ' + campos.nombre.value.trim();
        texto += '\nCorreo: ' + campos.correo.value.trim();
        if (campos.telefono.value.trim()) {
            texto += '\nTeléfono: ' + campos.telefono.value.trim();
        }
        if (medios.length > 0) {
            texto += '\nPrefiero que me contacten por: ' + medios.join(', ');
        }
        const detalle = document.getElementById('detalle').value.trim();
        if (detalle) {
            texto += '\nDetalles: ' + detalle;
        }

        const enlace = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);

        confirmacion.innerHTML = '';
        const titulo = document.createElement('h3');
        titulo.textContent = '¡Tu pedido está listo, ' + campos.nombre.value.trim().split(' ')[0] + '!';
        const parrafo = document.createElement('p');
        parrafo.textContent = 'Revisa el mensaje y envíalo a Ginger por WhatsApp. Te confirmará la disponibilidad y el precio final.';
        const vista = document.createElement('pre');
        vista.textContent = texto;
        const boton = document.createElement('a');
        boton.className = 'boton boton-whatsapp';
        boton.href = enlace;
        boton.target = '_blank';
        boton.rel = 'noopener noreferrer';
        boton.textContent = 'Enviar pedido por WhatsApp';

        confirmacion.append(titulo, parrafo, vista, boton);
        confirmacion.hidden = false;
        confirmacion.focus();
        confirmacion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Botón "Limpiar formulario": se borran errores, resumen y confirmación
    formulario.addEventListener('reset', function () {
        setTimeout(function () {                     // espera a que el navegador limpie los campos
            formulario.querySelectorAll('.error').forEach(function (e) { e.remove(); });
            Object.keys(campos).forEach(function (id) {
                campos[id].classList.remove('campo-invalido');
                campos[id].removeAttribute('aria-invalid');
                campos[id].removeAttribute('aria-describedby');
            });
            confirmacion.hidden = true;
            mostrarResumen();
        }, 0);
    });

    mostrarResumen();                                // estado inicial
});


/* ================= Funciones de apoyo ================= */

// Fecha de hoy en formato AAAA-MM-DD (el mismo del campo date)
function fechaHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return hoy.getFullYear() + '-' + mes + '-' + dia;
}

// "2026-12-24" -> "24-12-2026"
function formatoFecha(valor) {
    return valor.split('-').reverse().join('-');
}

// 30000 -> "$30.000"
function formatoPesos(numero) {
    return '$' + numero.toLocaleString('es-CL');
}

function plural(n, singular, varios) {
    return n === 1 ? singular : varios;
}
