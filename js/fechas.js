// Servicio encargado del procesamiento del set de datos global
import { calcularDiferencia, obtenerProximoAniversario, formatearTiempoDinamico } from './utilidades.js';

export function procesarDatos(data) {
    let eventosPlanos = [];

    // Si viene de Supabase (Array directo de eventos)
    if (Array.isArray(data)) {
        eventosPlanos = data;
    } 
    // Si viene del JSON estructurado antiguo ({ grupos: [...] })
    else if (data && data.grupos) {
        data.grupos.forEach(grupo => {
            grupo.eventos.forEach(e => {
                eventosPlanos.push({
                    ...e,
                    grupo: grupo.nombre,
                    color: grupo.color,
                    icono: grupo.icono
                });
            });
        });
    }

    // Procesar cada evento con tus cálculos de tiempo dinámicos
    return eventosPlanos.map(e => {
        let eventoProcesado = { ...e };

        if (e.tipo === 'desde') {
            const diff = calcularDiferencia(e.fecha);
            eventoProcesado.textoTiempo = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days, 'desde');
            eventoProcesado.diasAbsolutos = diff.totalDays;
            eventoProcesado.fechaOrdenacion = new Date(e.fecha);

        } else if (e.tipo === 'periodo') {
            const diff = calcularDiferencia(e.inicio, e.fin);
            eventoProcesado.textoTiempo = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days, 'periodo');
            eventoProcesado.diasAbsolutos = diff.totalDays;
            eventoProcesado.fechaOrdenacion = new Date(e.inicio);

        } else if (e.tipo === 'hasta') {
            const diff = calcularDiferencia(new Date(), e.fecha);
            eventoProcesado.textoTiempo = formatearTiempoDinamico(diff.years, diff.months, diff.weeks, diff.days, 'hasta');
            eventoProcesado.diasAbsolutos = diff.totalDays;
            eventoProcesado.fechaOrdenacion = new Date(e.fecha);

        } else if (e.tipo === 'aniversario') {
            const prox = obtenerProximoAniversario(e.fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const diffAniv = calcularDiferencia(hoy, prox.fechaExacta);
            const tiempoFaltante = formatearTiempoDinamico(diffAniv.years, diffAniv.months, diffAniv.weeks, diffAniv.days, 'desde');

            if (prox.diasFaltantes === 0) {
                eventoProcesado.textoTiempo = `¡Aniv. #${prox.edad} es HOY! 🎉`;
            } else {
                eventoProcesado.textoTiempo = `Aniv. #${prox.edad} en ${tiempoFaltante}`;
            }

            eventoProcesado.diasAbsolutos = prox.diasFaltantes;
            eventoProcesado.fechaOrdenacion = new Date(e.fecha);
        }

        return eventoProcesado;
    });
}

import { Storage } from './storage.js';