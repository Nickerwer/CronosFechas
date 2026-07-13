// Renderizador Dinámico de Tarjetas y Acordeones
import { Storage } from './storage.js';

export function renderizarUI(grupos, eventosFiltrados) {
    const container = document.getElementById('accordionContainer');
    container.innerHTML = '';
    const abiertos = Storage.get('gruposAbiertos', {});

    grupos.forEach((grupo, idx) => {
        const evGrupo = eventosFiltrados.filter(e => e.grupoNombre === grupo.nombre);
        if (evGrupo.length === 0) return; // Ocultar si la búsqueda vacía el grupo

        const item = document.createElement('div');
        item.className = `accordion-item ${abiertos[grupo.nombre] ? 'open' : ''}`;
        
        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.style.borderLeft = `5px solid ${grupo.color}`;
        header.innerHTML = `
            <div class="accordion-title-container">
                <span>${grupo.icono || '📁'}</span>
                <span>${grupo.nombre}</span>
                <span class="badge" style="background:${grupo.color}">${evGrupo.length}</span>
            </div>
            <span class="arrow">${abiertos[grupo.nombre] ? '▼' : '►'}</span>
        `;

        header.addEventListener('click', () => {
            item.classList.toggle('open');
            abiertos[grupo.nombre] = item.classList.contains('open');
            Storage.set('gruposAbiertos', abiertos);
            header.querySelector('.arrow').innerText = item.classList.contains('open') ? '▼' : '►';
        });

        const content = document.createElement('div');
        content.className = 'accordion-content';

        evGrupo.forEach(e => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${e.titulo}</span>
                    <span class="favorite-star ${e.favorito ? 'active' : ''}">★</span>
                </div>
                <div class="card-meta">${e.fecha || (e.inicio + ' al ' + e.fin)}</div>
                <div class="card-time">${e.textoTiempo}</div>
                ${e.notas ? `<p class="card-notes">${e.notas}</p>` : ''}
                <div class="tags-container">
                    ${(e.tags || []).map(t => `<span class="tag-chip">${t}</span>`).join('')}
                </div>
            `;
            // Listener interactivo mutar favorito reactivamente local
            card.querySelector('.favorite-star').addEventListener('click', (ev) => {
                ev.stopPropagation();
                e.favorito = !e.favorito;
                document.dispatchEvent(new CustomEvent('datosModificados'));
            });
            content.appendChild(card);
        });

        item.appendChild(header);
        item.appendChild(content);
        container.appendChild(item);
    });
}