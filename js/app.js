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

    const formatBtn = document.getElementById('formatToggle');
    if (formatBtn) {
        // Definimos el icono inicial según lo guardado
        const actualFormat = Storage.get('timeFormat', 'corto');
        formatBtn.innerText = actualFormat === 'largo' ? '💬' : '⏱️';

        formatBtn.addEventListener('click', () => {
            const nuevoFormat = Storage.get('timeFormat', 'corto') === 'corto' ? 'largo' : 'corto';
            Storage.set('timeFormat', nuevoFormat);
            
            // Cambiamos el icono del botón para dar feedback visual
            formatBtn.innerText = nuevoFormat === 'largo' ? '💬' : '⏱️';
            formatBtn.title = nuevoFormat === 'largo' ? "Cambiar a formato Corto" : "Cambiar a formato Largo";

            // Forzamos a la app a volver a calcular los textos y pintar la pantalla
            actualizarFlujoMuestreo();
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

    // Estados posibles: 'normal' (tarjetas), 'compact' (lista grid), 'simple' (texto corrido)
    let currentMode = Storage.get('viewMode', 'normal');

    // Aplicar el modo guardado al arrancar
    aplicarModoVista(currentMode, btn);

    btn.addEventListener('click', () => {
        // Ciclo de cambio: Normal -> Compacto -> Súper Simple -> Normal
        if (currentMode === 'normal') {
            currentMode = 'compact';
        } else if (currentMode === 'compact') {
            currentMode = 'simple';
        } else {
            currentMode = 'normal';
        }

        Storage.set('viewMode', currentMode);
        aplicarModoVista(currentMode, btn);
    });
}

function aplicarModoVista(modo, boton) {
    // Limpiamos clases previas del body
    document.body.classList.remove('compact-mode', 'super-simple-mode');

    if (modo === 'compact') {
        document.body.classList.add('compact-mode');
        boton.innerText = '📱'; // Icono para vista compacta
        boton.title = "Cambiar a vista Texto Simple";
    } else if (modo === 'simple') {
        document.body.classList.add('super-simple-mode');
        boton.innerText = '📝'; // Icono para vista de texto plano
        boton.title = "Cambiar a vista Tarjetas Normal";
    } else {
        boton.innerText = '📋'; // Icono para vista normal
        boton.title = "Cambiar a vista Lista Compacta";
    }
}

document.addEventListener('DOMContentLoaded', arrancarApp);