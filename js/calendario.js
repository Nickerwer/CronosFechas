// js/calendario.js

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();

export function inicializarCalendario(eventos) {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (!prevBtn || !nextBtn) return;

    // Eliminar listeners antiguos para evitar duplicados al revincular
    const nuevoPrev = prevBtn.cloneNode(true);
    const nuevoNext = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(nuevoPrev, prevBtn);
    nextBtn.parentNode.replaceChild(nuevoNext, nextBtn);

    nuevoPrev.addEventListener('click', () => {
        mesActual--;
        if (mesActual < 0) {
            mesActual = 11;
            anioActual--;
        }
        renderizarMes(eventos);
    });

    nuevoNext.addEventListener('click', () => {
        mesActual++;
        if (mesActual > 11) {
            mesActual = 0;
            anioActual++;
        }
        renderizarMes(eventos);
    });

    renderizarMes(eventos);
}

function renderizarMes(eventos) {
    const grid = document.getElementById('calendarGrid');
    const titulo = document.getElementById('calendarTitle');
    if (!grid || !titulo) return;

    grid.innerHTML = '';

    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    titulo.innerText = `${nombresMeses[mesActual]} ${anioActual}`;

    // Cabeceras de los días de la semana
    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    diasSemana.forEach(dia => {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell header';
        cell.innerText = dia;
        grid.appendChild(cell);
    });

    // Obtener primer día del mes y total de días
    const primerDiaIndex = new Date(anioActual, mesActual, 1).getDay(); // 0 = Domingo, 1 = Lunes...
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

    // Ajustar el índice para que la semana empiece en Lunes (0-6: Lun-Dom)
    const offset = primerDiaIndex === 0 ? 6 : primerDiaIndex - 1;

    // Celdas vacías al inicio del mes
    for (let i = 0; i < offset; i++) {
        const vacia = document.createElement('div');
        vacia.className = 'calendar-cell empty';
        grid.appendChild(vacia);
    }

    // Dibujar los días del mes y colocar sus eventos correspondientes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.innerHTML = `<div class="calendar-day-num">${dia}</div>`;

        // Fecha actual de la celda que estamos dibujando
        const fechaCeldaStr = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        // Filtrar eventos que ocurren en esta fecha exacta
        const eventosDelDia = eventos.filter(e => {
            if (e.fecha) return e.fecha === fechaCeldaStr;
            if (e.inicio) return e.inicio === fechaCeldaStr || e.fin === fechaCeldaStr;
            return false;
        });

        eventosDelDia.forEach(e => {
            const ind = document.createElement('div');
            ind.className = 'calendar-event-indicator';
            ind.style.backgroundColor = e.grupoColor || '#007AFF';
            ind.title = `${e.titulo} (${e.grupoNombre})`;
            ind.innerText = `${e.grupoIcono} ${e.titulo}`;
            cell.appendChild(ind);
        });

        grid.appendChild(cell);
    }
}