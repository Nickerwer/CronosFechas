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
    hoy.setHours(0, 0, 0, 0); // Normalizamos hoy a las 00:00:00
    
    const f = new Date(fecha);
    
    // Calculamos el aniversario para el año actual a las 00:00:00
    let prox = new Date(hoy.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0, 0);
    
    // Si el aniversario de este año ya pasó (o es antes de hoy), pasa al año siguiente
    if (prox < hoy) {
        prox.setFullYear(hoy.getFullYear() + 1);
    }
    
    // Diferencia matemática limpia en días
    const diffTime = prox.getTime() - hoy.getTime();
    const diasFaltantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const edad = prox.getFullYear() - f.getFullYear();
    
    // Retornamos 'fechaExacta' de forma explícita para que coincida con el importador
    return { 
        fechaExacta: prox, 
        diasFaltantes, 
        edad 
    };
}

// Función para formatear el tiempo según la preferencia guardada
export function formatearTiempoDinamico(years, months, weeks, days, tipo = 'desde') {
    const formatoLargo = Storage.get('timeFormat', 'corto') === 'largo';

    if (!formatoLargo) {
        // Formato Corto original (ej: 12a 9m 3s 2d)
        let partes = [];
        if (years > 0) partes.push(`${years}a`);
        if (months > 0) partes.push(`${months}m`);
        if (weeks > 0) partes.push(`${weeks}s`);
        if (days > 0 || partes.length === 0) partes.push(`${days}d`);
        return partes.join(' ');
    } else {
        // Formato Largo solicitado (ej: 12 años, 9 meses, 3 semanas y 2 días)
        let partes = [];
        if (years > 0) partes.push(years === 1 ? '1 año' : `${years} años`);
        if (months > 0) partes.push(months === 1 ? '1 mes' : `${months} meses`);
        if (weeks > 0) partes.push(weeks === 1 ? '1 semana' : `${weeks} semanas`);
        if (days > 0 || partes.length === 0) partes.push(days === 1 ? '1 día' : `${days} días`);

        if (partes.length === 0) return 'hoy';
        if (partes.length === 1) return partes[0];
        
        // Unir de forma natural con comas y una "y" al final
        const ultimo = partes.pop();
        return `${partes.join(', ')} y ${ultimo}`;
    }
}