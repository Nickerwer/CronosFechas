import { Storage } from './storage.js';

export function inicializarTema() {
    const btn = document.getElementById('themeToggle');
    const preferedDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = Storage.get('theme', preferedDark ? 'dark' : 'light');

    if (currentTheme === 'dark') document.body.classList.add('dark-mode');

    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const nuevoTema = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        Storage.set('theme', nuevoTema);
    });
}