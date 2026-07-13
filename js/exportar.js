export function exportarJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cronos-fechas.json'; a.click();
}

export function exportarCSV(eventos) {
    let csv = 'Titulo,Grupo,Tipo,Fecha/Inicio,TiempoCalculado\n';
    eventos.forEach(e => {
        csv += `"${e.titulo}","${e.grupoNombre}","${e.tipo}","${e.fecha || e.inicio}","${e.textoTiempo}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cronos-fechas.csv'; a.click();
}