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
    const data = {
        establecimiento: document.getElementById('establecimiento').value,
        estudiante: document.getElementById('estudiante').value,
        curso: document.getElementById('curso').value,
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('narrativo').value || "Sin descripción narrativa."
    };

    localStorage.setItem('informeCaso', JSON.stringify(data));
    alert('Datos guardados ✔️');
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