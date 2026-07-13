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
                e.textoTiempo = `${diff.years}a ${diff.months}m ${diff.weeks}s ${diff.days}d`;
                e.diasAbsolutos = diff.totalDays;
                e.fechaOrdenacion = new Date(e.fecha);
            } else if (e.tipo === 'periodo') {
                const diff = calcularDiferencia(e.inicio, e.fin);
                e.textoTiempo = `Duración: ${diff.years}a ${diff.months}m ${diff.totalDays % 30}d`;
                e.diasAbsolutos = diff.totalDays;
                e.fechaOrdenacion = new Date(e.inicio);
            } else if (e.tipo === 'hasta') {
                const diff = calcularDiferencia(new Date(), e.fecha);
                e.textoTiempo = `Faltan: ${diff.months}m ${diff.totalDays % 30}d`;
                e.diasAbsolutos = diff.totalDays;
                e.fechaOrdenacion = new Date(e.fecha);
            } else if (e.tipo === 'aniversario') {
                const prox = obtenerProximoAniversario(e.fecha);
                e.textoTiempo = `Aniv. #${prox.edad} en ${prox.diasFaltantes} días`;
                e.diasAbsolutos = prox.diasFaltantes;
                e.fechaOrdenacion = new Date(e.fecha);
            }
            todosEventos.push(e);
        });
    });
    return todosEventos;
}