// Servicio encargado del procesamiento del set de datos global
import { calcularDiferencia, obtenerProximoAniversario } from './utilidades.js';

export function procesarDatos(grupos) {
    let todosEventos = [];
    grupos.forEach(g => {
        g.eventos.forEach(e => {
            e.grupoNombre = g.nombre;
            e.grupoColor = g.color || '#007AFF';
            e.grupoIcono = g.icono || '📅';
            
            // Inyectar cálculo de tiempos en caliente
            if (e.tipo === 'desde') {
                const diff = calcularDiferencia(e.fecha);
                e.textoTiempo = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days);
                e.diasAbsolutos = diff.totalDays;
                e.fechaOrdenacion = new Date(e.fecha);
            } else if (e.tipo === 'periodo') {
                const diff = calcularDiferencia(e.inicio, e.fin);
                const tiempoFormateado = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days);
                e.textoTiempo = `Duración: ${tiempoFormateado}`;
                e.diasAbsolutos = diff.totalDays;
                e.fechaOrdenacion = new Date(e.inicio);
            } else if (e.tipo === 'hasta') {
                const diff = calcularDiferencia(new Date(), e.fecha);
                const tiempoFormateado = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days);
                e.textoTiempo = `Faltan: ${tiempoFormateado}`;
                e.diasAbsolutos = diff.totalDays;
                e.fechaOrdenacion = new Date(e.fecha);
            } else if (e.tipo === 'aniversario') {
                // 1. Obtenemos los datos limpios de la función de utilidades corregida
                const prox = obtenerProximoAniversario(e.fecha);
                
                // 2. Normalizamos "hoy" a medianoche para que coincida perfectamente con la función
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                
                // 3. Calculamos la diferencia exacta usando "fechaExacta" que ahora sí existe
                const diffAniv = calcularDiferencia(hoy, prox.fechaExacta); 
                
                // 4. Formateamos el tiempo restante de forma dinámica (Corto / Largo)
                const tiempoFaltante = formatearTiempoDinamico(
                    diffAniv.years, 
                    diffAniv.months, 
                    diffAniv.weeks, 
                    diffAniv.days, 
                    'desde'
                );
                e.tiempoFaltante = tiempoFaltante;
                
                // 5. Asignamos el texto final evaluando si el aniversario es hoy mismo
                if (prox.diasFaltantes === 0) {
                    e.textoTiempo = `¡Aniv. #${prox.edad} es HOY! 🎉`;
                } else {
                    e.textoTiempo = `Aniv. #${prox.edad} en ${tiempoFaltante}`;
                }
                
                e.diasAbsolutos = prox.diasFaltantes;
                e.fechaOrdenacion = new Date(e.fecha);
            }
            todosEventos.push(e);
        });
    });
    return todosEventos;
}

import { Storage } from './storage.js';

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