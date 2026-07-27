// Renderizador Dinámico de Tarjetas y Acordeones
import { Storage } from './storage.js';
import { supabase } from './supabaseClient.js';

export function renderizarUI(datos, eventosFiltrados) {
    const container = document.getElementById('accordionContainer');
    container.innerHTML = '';
    const abiertos = Storage.get('gruposAbiertos', {});

    // 1. Detección inteligente de grupos (Soporta JSON antiguo y Supabase)
    let listaGrupos = [];
    if (Array.isArray(datos) && datos.length > 0 && !datos[0].eventos) {
        // Datos de Supabase: Extraemos grupos únicos agrupando la lista plana
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
        // Formato JSON tradicional
        listaGrupos = datos.grupos;
    } else if (Array.isArray(datos)) {
        listaGrupos = datos;
    }

    // 2. Renderizado de Acordeones
    listaGrupos.forEach((grupo) => {
        // Filtrar eventos pertenecientes a este grupo (evalúa e.grupo o e.grupoNombre)
        const evGrupo = eventosFiltrados.filter(e => (e.grupo || e.grupoNombre) === grupo.nombre);
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

            // Listener interactivo para mutar favorito en Supabase y localmente
            card.querySelector('.favorite-star').addEventListener('click', async (ev) => {
                ev.stopPropagation();
                
                const nuevoEstadoFavorito = !e.favorito;
                e.favorito = nuevoEstadoFavorito; // Actualización visual rápida (UI optimista)

                // Si el evento tiene ID (proviene de Supabase), actualizamos en la nube
                if (e.id) {
                    try {
                        const { error } = await supabase
                            .from('eventos')
                            .update({ favorito: nuevoEstadoFavorito })
                            .eq('id', e.id);

                        if (error) console.error('Error guardando favorito en Supabase:', error);
                    } catch (err) {
                        console.error('Error de conexión con Supabase:', err);
                    }
                }

                // Disparar evento para actualizar el resto de la interfaz (estadísticas, etc.)[cite: 4]
                document.dispatchEvent(new CustomEvent('datosModificados'));
            });

            content.appendChild(card);
        });

        item.appendChild(header);
        item.appendChild(content);
        container.appendChild(item);
    });
}