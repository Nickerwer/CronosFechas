// Servicio encargado del procesamiento del set de datos global
import { calcularDiferencia, obtenerProximoAniversario, formatearTiempoDinamico } from './utilidades.js';

export function procesarDatos(data) {
    let eventosPlanos = [];

    // 1. Normalización de entrada (Supabase vs JSON tradicional)
    if (Array.isArray(data) && data.length > 0 && !data[0].eventos) {
        eventosPlanos = data.map(e => ({
            ...e,
            grupoNombre: e.grupo || e.grupoNombre || 'General',
            grupoColor: e.color || e.grupoColor || '#4f46e5',
            grupoIcono: e.icono || e.grupoIcono || '📅'
        }));
    } else if (data && data.grupos) {
        data.grupos.forEach(grupo => {
            (grupo.eventos || []).forEach(e => {
                eventosPlanos.push({
                    ...e,
                    grupo: grupo.nombre,
                    grupoNombre: grupo.nombre,
                    color: grupo.color,
                    grupoColor: grupo.color,
                    icono: grupo.icono,
                    grupoIcono: grupo.icono
                });
            });
        });
    }

    // 2. Cálculo de tiempos
    return eventosPlanos.map(e => {
        let eventoProcesado = { ...e };
        let textoCalculado = '';

        if (e.tipo === 'desde') {
            const diff = calcularDiferencia(e.fecha);
            textoCalculado = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days, 'desde');
            eventoProcesado.diasAbsolutos = diff.totalDays;
            eventoProcesado.fechaOrdenacion = new Date(e.fecha);

        } else if (e.tipo === 'periodo') {
            const diff = calcularDiferencia(e.inicio, e.fin);
            textoCalculado = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days, 'periodo');
            eventoProcesado.diasAbsolutos = diff.totalDays;
            eventoProcesado.fechaOrdenacion = new Date(e.inicio);

        } else if (e.tipo === 'hasta') {
            const diff = calcularDiferencia(new Date(), e.fecha);
            textoCalculado = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days, 'hasta');
            eventoProcesado.diasAbsolutos = diff.totalDays;
            eventoProcesado.fechaOrdenacion = new Date(e.fecha);

        } else if (e.tipo === 'aniversario') {
            const prox = obtenerProximoAniversario(e.fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const diffAniv = calcularDiferencia(hoy, prox.fechaExacta);
            const tiempoFaltanteStr = formatearTiempoDinamico(diffAniv.years, diffAniv.months, diffAniv.weeks, diffAniv.days, 'desde');

            if (prox.diasFaltantes === 0) {
                textoCalculado = `¡Aniv. #${prox.edad} es HOY! 🎉`;
            } else {
                textoCalculado = `Aniv. #${prox.edad} en ${tiempoFaltanteStr}`;
            }

            // Guardamos directamente el tiempo formateado para las estadísticas
            eventoProcesado.tiempoFaltante = tiempoFaltanteStr; 
            eventoProcesado.diasAbsolutos = prox.diasFaltantes;
            eventoProcesado.fechaOrdenacion = new Date(e.fecha);
        }

        // Si no se asignó arriba (casos 'hasta', 'desde', 'periodo'), usamos el texto calculado
        eventoProcesado.tiempoFaltante = eventoProcesado.tiempoFaltante || textoCalculado;
        eventoProcesado.textoTiempo = textoCalculado;
        eventoProcesado.fechaTexto = e.fecha || (e.inicio && e.fin ? `${e.inicio} al ${e.fin}` : 'Sin fecha');

        return eventoProcesado;
    });
}