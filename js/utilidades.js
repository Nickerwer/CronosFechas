// Operaciones de cálculo de fechas de alta precisión
export function calcularDiferencia(fechaInicio, fechaFin = new Date()) {
    let start = new Date(fechaInicio);
    let end = new Date(fechaFin);
    if (start > end) [start, end] = [end, start];

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months--;
        let prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    return { years, months, weeks, days: remainingDays, totalDays };
}

export function obtenerProximoAniversario(fecha) {
    const hoy = new Date();
    const f = new Date(fecha);
    let prox = new Date(hoy.getFullYear(), f.getMonth(), f.getDate());
    if (prox < hoy) prox.setFullYear(hoy.getFullYear() + 1);
    
    const diffTime = prox - hoy;
    const diasFaltantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const edad = prox.getFullYear() - f.getFullYear();
    return { fecha: prox, diasFaltantes, edad };
}