/* =====================================================================
   La Casita de Ginger · horario.js
   Funcionalidad de la página "Contacto":
     4. Destaca el día de hoy en el horario e indica si el local
        está abierto en este momento.
   Autor: Rodrigo Tranolao · Diseño Web · Evaluación N°3
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    const dias = document.querySelectorAll('.horario li');
    if (dias.length !== 7) {
        return;                                      // la página no tiene el horario
    }

    const ahora = new Date();
    // getDay(): 0 = domingo, 1 = lunes ... 6 = sábado. La lista empieza en lunes.
    const indice = (ahora.getDay() + 6) % 7;
    const hoy = dias[indice];
    hoy.classList.add('hoy');

    // Se lee el horario escrito en la página, por ejemplo "9:30 - 20:30"
    const textoHorario = hoy.lastElementChild.textContent;
    const partes = textoHorario.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);

    let abierto = false;
    let detalle = '';

    if (partes) {
        const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
        const apertura = Number(partes[1]) * 60 + Number(partes[2]);
        const cierre   = Number(partes[3]) * 60 + Number(partes[4]);

        if (minutosAhora >= apertura && minutosAhora < cierre) {
            abierto = true;
            detalle = 'Cerramos a las ' + partes[3] + ':' + partes[4];
        } else if (minutosAhora < apertura) {
            detalle = 'Hoy abrimos a las ' + partes[1] + ':' + partes[2];
        } else {
            detalle = 'Ya cerramos por hoy';
        }
    } else {
        detalle = 'Hoy el local está cerrado';
    }

    // Se crea el aviso y se agrega bajo el título "Horario"
    const estado = document.createElement('p');
    estado.className = abierto ? 'estado-local abierto' : 'estado-local cerrado';

    const etiqueta = document.createElement('strong');
    etiqueta.textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora';
    estado.appendChild(etiqueta);
    estado.append(' · ' + detalle);

    document.querySelector('#horario h2').insertAdjacentElement('afterend', estado);
});
