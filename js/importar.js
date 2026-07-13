export function inicializarImportador(callback) {
    const input = document.getElementById('importFile');
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = JSON.parse(evt.target.result);
                if (data.grupos) callback(data);
            } catch (err) { alert('Archivo JSON inválido.'); }
        };
        reader.readAsText(file);
    });
}