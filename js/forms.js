function calcularTotal() {
    let total = 0;

    // Secciones A y B (1-12)
    for (let i = 1; i <= 12; i++) {
        const radios = document.getElementsByName('c' + i);
        radios.forEach(radio => {
            if (radio.checked) {
                total += parseInt(radio.value);
            }
        });
    }

    // Secciones C, D, F (13-24)
    for (let i = 13; i <= 24; i++) {
        const radios = document.getElementsByName('c' + i);
        radios.forEach(radio => {
            if (radio.checked) {
                total += parseInt(radio.value);
            }
        });
    }

    // Contextos ( checkboxes )
    const contextos = document.querySelectorAll('input[name="contexto"]:checked');
    total += contextos.length;

    // Impactos ( checkboxes )
    const impactos = document.querySelectorAll('input[name="impacto"]:checked');
    total += impactos.length;

    document.getElementById('total').textContent = total;

    // Interpretación
    const interpDiv = document.getElementById('interpretacion');
    const resultadoTexto = document.getElementById('resultado-texto');

    if (total <= 10) {
        resultadoTexto.textContent = '✓ SIN INDICADORES SIGNIFICATIVOS (0-10 puntos) - Continuar monitoreo regular.';
        interpDiv.style.background = '#d5f4e6';
        interpDiv.style.borderLeftColor = '#27ae60';
    } else if (total <= 25) {
        resultadoTexto.textContent = '⚠ INDICADORES LEVES/MODERADOS (11-25 puntos) - Derivar a convivencia escolar para investigación.';
        interpDiv.style.background = '#fff9e6';
        interpDiv.style.borderLeftColor = '#f39c12';
    } else if (total <= 40) {
        resultadoTexto.textContent = '⛔ INDICADORES SEVEROS (26-40 puntos) - ACTIVAR PROTOCOLO DE ACOSO ESCOLAR INMEDIATAMENTE.';
        interpDiv.style.background = '#fadbd8';
        interpDiv.style.borderLeftColor = '#e74c3c';
    } else {
        resultadoTexto.textContent = '🚨 INDICADORES MUY SEVEROS (41-60 puntos) - ACTIVAR PROTOCOLO URGENTE Y CONSIDERAR MEDIDAS PREVENTIVAS.';
        interpDiv.style.background = '#ebcccc';
        interpDiv.style.borderLeftColor = '#c0392b';
    }
    interpDiv.style.display = 'block';
}

function guardarDatos() {
    const getCheckedValues = (name) => {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => {
            // prefer label text if available
            if (input.id) {
                const lbl = document.querySelector(`label[for="${input.id}"]`);
                if (lbl && lbl.textContent) return lbl.textContent.trim();
            }
            if (input.value && input.value !== 'on') return input.value;
            return input.id || '';
        }).filter(Boolean);
    };

    const sexoElem = document.querySelector('input[name="sexo"]:checked');
    // Build per-question items (question text, response, observation)
    const items = [];
    for (let i = 1; i <= 24; i++) {
        const radios = Array.from(document.getElementsByName('c' + i));
        let questionText = '';
        let response = '';
        let observation = '';

        if (radios.length) {
            // find a radio to get the row text
            const sample = radios[0];
            const tr = sample.closest && sample.closest('tr');
            if (tr) {
                const firstTd = tr.querySelector('td');
                if (firstTd) questionText = firstTd.textContent.trim();
                const obsInput = tr.querySelector('input[type="text"]');
                if (obsInput) observation = obsInput.value || '';
            }

            const checked = radios.find(r => r.checked);
            if (checked) {
                // if binary (two radios) -> Sí/No
                if (radios.length === 2) {
                    response = checked.value === '1' ? 'Sí' : 'No';
                } else {
                    // map numeric scale
                    const v = checked.value;
                    const map = { '0': 'No observado', '1': 'Raramente', '2': 'Ocasionalmente', '3': 'Frecuentemente' };
                    response = map[v] || v;
                }
            } else {
                response = '';
            }
        }
        if (questionText || response || observation) items.push({ question: questionText, response, observation });
    }

    const data = {
        establecimiento: document.getElementById('establecimiento')?document.getElementById('establecimiento').value:'',
        estudiante: document.getElementById('estudiante')?document.getElementById('estudiante').value:'',
        curso: document.getElementById('curso')?document.getElementById('curso').value:'',
        fecha: document.getElementById('fecha')?document.getElementById('fecha').value:'',
        docente: document.getElementById('docente')?document.getElementById('docente').value:'',
        asignatura: document.getElementById('asignatura')?document.getElementById('asignatura').value:'',
        sexo: sexoElem?sexoElem.value:'',
        edad: document.getElementById('edad')?document.getElementById('edad').value:'',
        fecha_desde: document.getElementById('fecha_desde')?document.getElementById('fecha_desde').value:'',
        fecha_hasta: document.getElementById('fecha_hasta')?document.getElementById('fecha_hasta').value:'',
        narrativo: (document.getElementById('narrativo') && document.getElementById('narrativo').value) || "",
        total: document.getElementById('total')?document.getElementById('total').textContent: '0',
        interpretacion: document.getElementById('resultado-texto')?document.getElementById('resultado-texto').textContent:'',
        contextos: getCheckedValues('contexto'),
        impactos: getCheckedValues('impacto')
        ,items: items
    };

    // Save to sessionStorage so print view can read it immediately after opening
    try{
        sessionStorage.setItem('printData', JSON.stringify(data));
    }catch(e){
        // fallback to localStorage if sessionStorage is unavailable
        localStorage.setItem('printData', JSON.stringify(data));
    }
}

function abrirInforme() {
    guardarDatos();
    window.open('print.html', '_blank');
}

function limpiarFormulario() {
    if (confirm('¿Desea limpiar todo el formulario?')) {
        document.querySelectorAll('input, textarea').forEach(elem => {
            if (elem.type === 'radio' || elem.type === 'checkbox') {
                elem.checked = false;
            } else {
                elem.value = '';
            }
        });
        document.getElementById('total').textContent = '0';
        document.getElementById('interpretacion').style.display = 'none';
    }
}

// Escuchar cambios para actualizar puntaje
document.addEventListener('DOMContentLoaded', function() {
    const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    allInputs.forEach(input => {
        input.addEventListener('change', calcularTotal);
    });

    // Inicializar con 0
    document.getElementById('total').textContent = '0';
});