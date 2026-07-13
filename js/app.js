// Orquestador Core del Ciclo de Vida de la App
import { inicializarTema } from './tema.js';
import { procesarDatos } from './fechas.js';
import { renderizarUI } from './render.js';
import { filtrarYOrdenar } from './buscador.js';
import { renderizarTimeline } from './timeline.js';
import { calcularEstadisticas } from './estadisticas.js';
import { exportarJSON, exportarCSV } from './exportar.js';
import { inicializarImportador } from './importar.js';
import { Storage } from './storage.js';
import { inicializarCalendario } from './calendario.js';

let DATA_GLOBAL = { grupos: [] };
let EVENTOS_FLAT = [];

async function arrancarApp() {
    inicializarTema();

    // Cargar la preferencia guardada de ordenación del timeline
    const timelineSortSelect = document.getElementById('timelineSort');
    if (timelineSortSelect) {
        timelineSortSelect.value = Storage.get('timelineSort', 'reciente');
        
        // 2. Escuchar cambios específicos del timeline sin afectar el resto de la app
        timelineSortSelect.addEventListener('change', (e) => {
            Storage.set('timelineSort', e.target.value);
            
            // Obtenemos los eventos filtrados actuales para actualizar solo el timeline
            const q = document.getElementById('searchInput').value;
            const c = document.getElementById('sortSelect').value;
            const filtrados = filtrarYOrdenar(EVENTOS_FLAT, q, c);
            
            renderizarTimeline(filtrados);
        });
    }
    
    // Recuperar últimos estados persistidos en LocalStorage
    document.getElementById('searchInput').value = Storage.get('lastSearch', '');
    document.getElementById('sortSelect').value = Storage.get('lastSort', 'reciente');

    try {
        const res = await fetch('fechas.json');
        DATA_GLOBAL = await res.json();
        actualizarFlujoMuestreo();
    } catch (e) {
        console.error("Carga local fallida, esperando importación manual.");
    }

    // Registro de Listeners de Eventos de Controles
    document.getElementById('searchInput').addEventListener('input', (e) => {
        Storage.set('lastSearch', e.target.value);
        actualizarFlujoMuestreo();
    });
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        Storage.set('lastSort', e.target.value);
        actualizarFlujoMuestreo();
    });

    // Gestión de Exportaciones
    document.getElementById('btnExportJSON').addEventListener('click', () => exportarJSON(DATA_GLOBAL));
    document.getElementById('btnExportCSV').addEventListener('click', () => exportarCSV(EVENTOS_FLAT));
    document.getElementById('btnPrint').addEventListener('click', () => window.print());

    inicializarImportador((nuevosDatos) => {
        DATA_GLOBAL = nuevosDatos;
        actualizarFlujoMuestreo();
    });

    // Evento personalizado reactivo
    document.addEventListener('datosModificados', actualizarFlujoMuestreo);
    inicializarTabs();
    inicializarVistaCompacta();
}

function actualizarFlujoMuestreo() {
    EVENTOS_FLAT = procesarDatos(DATA_GLOBAL.grupos);
    const q = document.getElementById('searchInput').value;
    const c = document.getElementById('sortSelect').value;
    
    const filtrados = filtrarYOrdenar(EVENTOS_FLAT, q, c);
    
    renderizarUI(DATA_GLOBAL.grupos, filtrados);
    renderizarTimeline(filtrados);
    calcularEstadisticas(DATA_GLOBAL.grupos, filtrados);

    inicializarCalendario(filtrados);
}

function inicializarTabs() {
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            document.getElementById(b.dataset.target).classList.add('active');
        });
    });
}

function inicializarVistaCompacta() {
    const btn = document.getElementById('viewToggle');
    if (!btn) return;

    // Leer el estado guardado del localStorage
    const isCompact = Storage.get('compactMode', false);
    if (isCompact) {
        document.body.classList.add('compact-mode');
        btn.innerText = '📱'; // Cambia el icono para indicar que está en modo lista
    }

    btn.addEventListener('click', () => {
        const active = document.body.classList.toggle('compact-mode');
        Storage.set('compactMode', active);
        btn.innerText = active ? '📱' : '📋'; // Alterna icono entre Lista y Tarjetas
    });
}

document.addEventListener('DOMContentLoaded', arrancarApp);