// js/timeline.js
import { Storage } from './storage.js';

export function renderizarTimeline(eventos) {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 1. Obtener el criterio exclusivo para el Timeline
    const criterioTimeline = document.getElementById('timelineSort')?.value || Storage.get('timelineSort', 'reciente');

    const crono = [...eventos];

    // 2. Ordenar basándose únicamente en la fecha
    if (criterioTimeline === 'antiguo') {
        crono.sort((a, b) => a.fechaOrdenacion - b.fechaOrdenacion);
    } else {
        crono.sort((a, b) => b.fechaOrdenacion - a.fechaOrdenacion);
    }

    // 3. Renderizar la vista
    crono.forEach(e => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-dot" style="background:${e.grupoColor}"></div>
            <div class="timeline-date">${e.fechaOrdenacion.toLocaleDateString()}</div>
            <div class="timeline-content">
                <strong>${e.grupoIcono} ${e.titulo}</strong> (${e.grupoNombre})
                <div style="font-size:0.8rem; color:var(--text-muted)">${e.textoTiempo}</div>
            </div>
        `;
        container.appendChild(item);
    });
}