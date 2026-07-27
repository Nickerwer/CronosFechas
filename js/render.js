// Renderizador Dinámico de Tarjetas y Acordeones
import { Storage } from './storage.js';
import { supabase } from './supabaseClient.js';

export function renderizarUI(datos, eventosFiltrados) {
    const container = document.getElementById('accordionContainer');
    container.innerHTML = '';
    const abiertos = Storage.get('gruposAbiertos', {});

    // Detección inteligente de grupos (Soporta JSON antiguo y Supabase)
    let listaGrupos = [];
    if (Array.isArray(datos) && datos.length > 0 && !datos[0].eventos) {
        const mapaGrupos = new Map();
        datos.forEach(e => {
            if (!mapaGrupos.has(e.grupo)) {
                mapaGrupos.set(e.grupo, {
                    nombre: e.grupo,
                    color: e.color || '#4f46e5',
                    icono: e.icono || '📁'
                });
            }
        });
        listaGrupos = Array.from(mapaGrupos.values());
    } else if (datos.grupos) {
        listaGrupos = datos.grupos;
    } else if (Array.isArray(datos)) {
        listaGrupos = datos;
    }

    // Renderizado de Acordeones y Tarjetas
    listaGrupos.forEach((grupo) => {
        const evGrupo = eventosFiltrados.filter(e => (e.grupo || e.grupoNombre) === grupo.nombre);
        if (evGrupo.length === 0) return;

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

            const esFav = Boolean(e.favorito);

            card.innerHTML = `
                <div class="card-header">
                    <span class="favorite-star ${esFav ? 'active' : ''}">★</span>
                    <span class="card-title">${e.titulo}</span>
                </div>
                <div class="card-meta">${e.fechaTexto || e.fecha || (e.inicio + ' al ' + e.fin)}</div>
                <div class="card-time">${e.textoTiempo}</div>
                ${e.notas ? `<p class="card-notes">${e.notas}</p>` : ''}
                <div class="tags-container">
                    ${(e.tags || []).map(t => `<span class="tag-chip">${t}</span>`).join('')}
                </div>
            `;

            const starEl = card.querySelector('.favorite-star');

            starEl.onclick = async (ev) => {
                ev.stopPropagation();

                e.favorito = !e.favorito;
                starEl.classList.toggle('active', e.favorito);

                if (e.id) {
                    const { error } = await supabase
                        .from('eventos')
                        .update({ favorito: e.favorito })
                        .eq('id', e.id);

                    if (error) {
                        console.error('Error al guardar en Supabase:', error);
                        // Si la red falla, revertimos únicamente esta estrella
                        e.favorito = !e.favorito;
                        starEl.classList.toggle('active', e.favorito);
                    }
                }
                
                // ¡IMPORTANTE! NO disparamos 'datosModificados' ni 'renderizarUI' aquí.
                // Así el acordeón NO se destruye ni se vuelve a construir.
            };

            content.appendChild(card);
        });

        item.appendChild(header);
        item.appendChild(content);
        container.appendChild(item);
    });
}