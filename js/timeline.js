// js/timeline.js
import { Storage } from './storage.js';


export function renderizarTimeline(eventos) {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
    container.innerHTML = '';

    // Obtenemos la fecha de hoy normalizada a medianoche
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // Formateamos la fecha actual en un texto amigable (ej: "27/7/2026" o "27 de julio de 2026")
    const fechaTextoHoy = hoy.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    // Creamos el objeto del punto fijo "Hoy"
    const eventoHoy = {
        id: 'punto-fijo-hoy',
        titulo: 'Día actual',
        fechaTexto: fechaTextoHoy,
        textoTiempo: '',
        fechaOrdenacion: hoy,
        esHoy: true, // Bandera opcional para darle estilos especiales CSS
        grupoColor: '#ef4444', // Color distintivo (rojo/destacado)
        grupoIcono: '📌'
    };
    
    // 1. Obtener el criterio exclusivo para el Timeline
    const criterioTimeline = document.getElementById('timelineSort')?.value || Storage.get('timelineSort', 'reciente');

    const crono = [...eventos, eventoHoy];

    // 2. Ordenar basándose únicamente en la fecha
    if (criterioTimeline === 'antiguo') {
        crono.sort((a, b) => a.fechaOrdenacion - b.fechaOrdenacion);
    } else {
        crono.sort((a, b) => b.fechaOrdenacion - a.fechaOrdenacion);
    }

    // 3. Renderizar la vista
    crono.forEach(e => {
        const item = document.createElement('div');
        
        // Si es el nodo de "Hoy", le asignamos una clase CSS especial para destacarlo
        item.className = `timeline-item ${e.esHoy ? 'timeline-item-hoy' : ''}`;
        
        item.innerHTML = `
            <div class="timeline-dot" style="background:${e.grupoColor}"></div>
            <div class="timeline-date">${e.fechaOrdenacion.toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })}</div>
            <div class="timeline-content">
                <strong>${e.grupoIcono} ${e.titulo}</strong>${e.grupoNombre ? ` (${e.grupoNombre})` : ''}
                <div style="font-size:0.8rem; color:var(--text-muted)">${e.textoTiempo}</div>
            </div>
        `;
        container.appendChild(item);
    });
}