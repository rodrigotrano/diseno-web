/* =====================================================================
   La Casita de Ginger · comentario.js
   Funcionalidad de la página "Nuestra historia":
     5. Formulario "Deja tu comentario": contador de caracteres,
        validación (blur / submit) y vista previa del comentario.
   Autor: Rodrigo Tranolao · Diseño Web · Evaluación N°3
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    const formulario = document.getElementById('form-comentario');
    if (!formulario) {
        return;
    }
    const gracias = document.getElementById('gracias');

    const campos = {
        nombre:     document.getElementById('testimonio-nombre'),
        correo:     document.getElementById('testimonio-correo'),
        comentario: document.getElementById('testimonio-comentario')
    };
    const valoracion = document.getElementById('testimonio-valoracion');
    const autoriza   = document.getElementById('testimonio-autoriza');

    formulario.setAttribute('novalidate', '');   // los avisos los muestra JavaScript

    // ---------- Contador de caracteres del comentario (evento input) ----------
    const maximo = Number(campos.comentario.getAttribute('maxlength')) || 500;
    const contador = document.createElement('small');
    contador.className = 'contador';
    contador.setAttribute('aria-live', 'polite');
    campos.comentario.insertAdjacentElement('afterend', contador);

    function actualizarContador() {
        const largo = campos.comentario.value.length;
        contador.textContent = largo + ' / ' + maximo + ' caracteres';
        contador.classList.toggle('cerca-limite', largo > maximo - 50);
    }
    campos.comentario.addEventListener('input', actualizarContador);
    actualizarContador();

    // ---------- Reglas de validación ----------
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
        comentario: function (valor) {
            if (valor === '') return 'Cuéntanos tu experiencia.';
            if (valor.length < 10) return 'El comentario debe tener al menos 10 caracteres.';
            return '';
        }
    };

    function validarCampo(id) {
        const campo = campos[id];
        const mensaje = reglas[id](campo.value.trim());
        let error = document.getElementById('error-' + campo.id);

        if (mensaje) {
            if (!error) {
                error = document.createElement('small');
                error.id = 'error-' + campo.id;
                error.className = 'error';
                // en el comentario el aviso va después del contador
                const ancla = id === 'comentario' ? contador : campo;
                ancla.insertAdjacentElement('afterend', error);
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

    // Evento blur: se valida al salir de cada campo
    Object.keys(campos).forEach(function (id) {
        campos[id].addEventListener('blur', function () {
            validarCampo(id);
        });
        campos[id].addEventListener('input', function () {
            if (campos[id].classList.contains('campo-invalido')) {
                validarCampo(id);
            }
        });
    });

    // ---------- Evento submit: valida y muestra el agradecimiento ----------
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        let primerError = null;
        Object.keys(campos).forEach(function (id) {
            if (!validarCampo(id) && !primerError) {
                primerError = campos[id];
            }
        });
        if (primerError) {
            primerError.focus();
            return;
        }

        const nombre = campos.nombre.value.trim();
        const nota = Number(valoracion.value);
        const estrellas = '★'.repeat(nota) + '☆'.repeat(5 - nota);

        // Cuerpo del correo con el comentario (la página no tiene servidor)
        const cuerpo = 'Nombre: ' + nombre +
                       '\nCorreo: ' + campos.correo.value.trim() +
                       '\nCalificación: ' + nota + ' de 5' +
                       '\nAutoriza publicar: ' + (autoriza.checked ? 'sí' : 'no') +
                       '\n\nComentario:\n' + campos.comentario.value.trim();
        const enlace = 'mailto:Fabiola.Avendano@gmail.com' +
                       '?subject=' + encodeURIComponent('Comentario de ' + nombre + ' - La Casita de Ginger') +
                       '&body=' + encodeURIComponent(cuerpo);

        gracias.innerHTML = '';
        const titulo = document.createElement('h3');
        titulo.textContent = '¡Gracias por tu comentario, ' + nombre.split(' ')[0] + '!';
        const vista = document.createElement('blockquote');
        vista.className = 'vista-comentario';
        const calificacion = document.createElement('p');
        calificacion.className = 'estrellas';
        calificacion.setAttribute('aria-label', 'Calificación: ' + nota + ' de 5');
        calificacion.textContent = estrellas;
        const texto = document.createElement('p');
        texto.textContent = '«' + campos.comentario.value.trim() + '»';
        vista.append(calificacion, texto);
        const boton = document.createElement('a');
        boton.className = 'boton';
        boton.href = enlace;
        boton.textContent = 'Enviar comentario por correo';

        gracias.append(titulo, vista, boton);
        gracias.hidden = false;
        gracias.focus();
        gracias.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // ---------- Evento reset: limpia avisos, contador y agradecimiento ----------
    formulario.addEventListener('reset', function () {
        setTimeout(function () {
            formulario.querySelectorAll('.error').forEach(function (e) { e.remove(); });
            Object.keys(campos).forEach(function (id) {
                campos[id].classList.remove('campo-invalido');
                campos[id].removeAttribute('aria-invalid');
                campos[id].removeAttribute('aria-describedby');
            });
            gracias.hidden = true;
            actualizarContador();
        }, 0);
    });
});
