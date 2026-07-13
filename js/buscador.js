export function filtrarYOrdenar(eventos, query, criterio) {
    let result = [...eventos];

    // 1. Buscador Instantáneo
    if (query) {
        const q = query.toLowerCase();
        result = result.filter(e => 
            e.titulo.toLowerCase().includes(q) ||
            e.grupoNombre.toLowerCase().includes(q) ||
            (e.notas && e.notes?.toLowerCase().includes(q)) ||
            (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
        );
    }

    // 2. Ordenación Estricta
    result.sort((a, b) => {
        if (criterio === 'favoritos') return (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0);
        if (criterio === 'alfabetico') return a.titulo.localeCompare(b.titulo);
        if (criterio === 'reciente') return b.fechaOrdenacion - a.fechaOrdenacion;
        if (criterio === 'antigua') return a.fechaOrdenacion - b.fechaOrdenacion;
        if (criterio === 'transcurrido') return b.diasAbsolutos - a.diasAbsolutos;
        return 0;
    });

    // Forzar favoritos arriba si el criterio base no es orden alfabético estricto
    if (criterio !== 'alfabetico') {
        result.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));
    }

    return result;
}