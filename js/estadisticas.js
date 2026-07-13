export function calcularEstadisticas(grupos, eventos) {
    const container = document.getElementById('statsContainer');
    if (!eventos.length) return;

    const favs = eventos.filter(e => e.favorito).length;
    const anivs = eventos.filter(e => e.tipo === 'aniversario').length;
    const periodos = eventos.filter(e => e.tipo === 'periodo').length;

    container.innerHTML = `
        <div><strong>Total Eventos:</strong> ${eventos.length}</div>
        <div><strong>Total Grupos:</strong> ${grupos.length}</div>
        <div><strong>Favoritos:</strong> ⭐ ${favs}</div>
        <div><strong>Aniversarios:</strong> 🎂 ${anivs}</div>
        <div><strong>Periodos:</strong> ⏳ ${periodos}</div>
    `;

    // Panel específico laterales de próximos aniversarios
    const anivContainer = document.getElementById('aniversariosContainer');
    anivContainer.innerHTML = '';
    
    const proximos = eventos
        .filter(e => e.tipo === 'aniversario')
        .sort((a,b) => a.diasAbsolutos - b.diasAbsolutos);

    proximos.slice(0, 5).forEach(e => {
        const el = document.createElement('div');
        el.style.padding = '5px 0';
        el.innerHTML = `• <strong>${e.titulo}</strong>: faltan ${e.diasAbsolutos} días (${e.tiempoFaltante})`;
        anivContainer.appendChild(el);
    });
}