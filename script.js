// Datos de las conductas
const conductas = {
  A: [
    "1. Insultos y palabras hirientes",
    "2. Burlas sobre apariencia u origen",
    "3. Amenazas verbales o intimidación",
    "4. Agresiones físicas (golpes, empujones)",
    "5. Lanzamiento de objetos con intención de herir",
    "6. Daño intencional a pertenencias ajenas"
  ],
  B: [
    "7. Exclusión deliberada de actividades",
    "8. Propagación de rumores y chismes",
    "9. Manipulación de amistades",
    "10. Expresiones de desprecio o menosprecio",
    "11. Rechazo sistemático a relacionarse",
    "12. Difusión de información vergonzosa"
  ],
  C: [
    "13. ¿Ejerce conductas sobre compañeros más débiles?",
    "14. ¿Hay desproporción de poder?",
    "15. ¿Conductas repetidas e intencionales?",
    "16. ¿Actúa con otros compañeros?",
    "17. ¿Se burla de reacciones de víctimas?",
    "18. ¿Conductas continúan tras correcciones?"
  ],
  D: [
    "19. Busca situaciones sin supervisión de adultos",
    "20. Niega, minimiza o culpa a la víctima",
    "21. Falta de empatía o remordimiento",
    "22. Mantiene o incrementa conductas",
    "23. Cambios en víctimas (comportamiento/asistencia)",
    "24. Otros estudiantes temen o lo evitan"
  ],
  F: [
    "Ausentismo o faltas frecuentes",
    "Bajo rendimiento académico",
    "Aislamiento social",
    "Síntomas de ansiedad o tristeza",
    "Cambios en apetito o sueño",
    "Retraimiento de actividades"
  ]
};

function renderTabla(id, items, tipo = 'escala') {
  const container = document.getElementById(id);
  container.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'tabla-header';
  header.innerHTML = `
    <div>Conducta</div>
    <div>0</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>Observaciones</div>
  `;
  container.appendChild(header);

  // Filas
  items.forEach((desc, i) => {
    const num = parseInt(id.replace(/\D/g, '')) + i;
    const fila = document.createElement('div');
    fila.className = 'tabla-fila';

    let radios = '';
    if (tipo === 'escala') {
      for (let v = 0; v <= 3; v++) {
        radios += `<input type="radio" name="c${num}" value="${v}" onchange="calcularTotal()">`;
      }
    } else { // binaria
      radios = `
        <input type="radio" name="c${num}" value="1" onchange="calcularTotal()">
        <input type="radio" name="c${num}" value="0" onchange="calcularTotal()">
      `;
    }

    fila.innerHTML = `
      <div class="conducta">${desc}</div>
      ${radios}
      <input type="text" placeholder="Observaciones" />
    `;
    container.appendChild(fila);
  });
}

function renderContextos() {
  const container = document.getElementById('listaContextos');
  const contextos = [
    "Sala de clases",
    "Recreos/espacios libres",
    "Baños",
    "Entrada/salida",
    "Comedor",
    "Redes sociales",
    "Camino al colegio"
  ];

  container.innerHTML = '';
  contextos.forEach(desc => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="contexto" onchange="calcularTotal()"> ${desc}`;
    container.appendChild(label);
  });
}

function calcularTotal() {
  let total = 0;

  // Secciones A y B (c1–c12)
  for (let i = 1; i <= 12; i++) {
    const checked = document.querySelector(`input[name="c${i}"]:checked`);
    if (checked) total += parseInt(checked.value);
  }

  // Secciones C y D (c13–c24)
  for (let i = 13; i <= 24; i++) {
    const checked = document.querySelector(`input[name="c${i}"]:checked`);
    if (checked) total += parseInt(checked.value);
  }

  // Contextos (Sección E)
  total += document.querySelectorAll('input[name="contexto"]:checked').length;

  // Impacto (Sección F)
  total += document.querySelectorAll('input[name="impacto"]:checked').length;

  document.getElementById('total').textContent = total;

  const interp = document.getElementById('interpretacion');
  let texto = '';
  let bg = '';
  let border = '';

  if (total <= 10) {
    texto = '✓ SIN INDICADORES SIGNIFICATIVOS (0-10 puntos) - Continuar monitoreo regular.';
    bg = '#d5f4e6';
    border = '#27ae60';
  } else if (total <= 25) {
    texto = '⚠ INDICADORES LEVES/MODERADOS (11-25 puntos) - Derivar a convivencia escolar para investigación.';
    bg = '#fff9e6';
    border = '#f39c12';
  } else if (total <= 40) {
    texto = '⛔ INDICADORES SEVEROS (26-40 puntos) - ACTIVAR PROTOCOLO DE ACOSO ESCOLAR INMEDIATAMENTE.';
    bg = '#fadbd8';
    border = '#e74c3c';
  } else {
    texto = '🚨 INDICADORES MUY SEVEROS (41-60 puntos) - ACTIVAR PROTOCOLO URGENTE Y CONSIDERAR MEDIDAS PREVENTIVAS.';
    bg = '#ebcccc';
    border = '#c0392b';
  }

  interp.textContent = texto;
  interp.style.display = 'block';
  interp.style.backgroundColor = bg;
  interp.style.borderLeftColor = border;
}

function limpiarFormulario() {
  if (!confirm('¿Desea limpiar todo el formulario?')) return;

  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.type === 'radio' || el.type === 'checkbox') {
      el.checked = false;
    } else {
      el.value = '';
    }
  });
  document.getElementById('total').textContent = '0';
  document.getElementById('interpretacion').style.display = 'none';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderTabla('tablaA', conductas.A, 'escala');
  renderTabla('tablaB', conductas.B, 'escala');
  renderTabla('tablaC', conductas.C, 'binaria');
  renderTabla('tablaD', conductas.D, 'binaria');
  renderContextos();

  // Renderizar tabla F (Impacto)
  const tablaF = document.getElementById('tablaF');
  tablaF.innerHTML = '';

  const headerF = document.createElement('div');
  headerF.className = 'tabla-header';
  headerF.innerHTML = `
    <div>Impacto</div>
    <div>Sí</div>
    <div>No</div>
  `;
  tablaF.appendChild(headerF);

  conductas.F.forEach((desc, i) => {
    const num = 25 + i;
    const fila = document.createElement('div');
    fila.className = 'tabla-fila';
    fila.innerHTML = `
      <div class="conducta">${desc}</div>
      <input type="checkbox" name="impacto" onchange="calcularTotal()">
      <input type="checkbox">
    `;
    tablaF.appendChild(fila);
  });

  // Eventos
  document.getElementById('btn-imprimir').addEventListener('click', () => window.print());
  document.getElementById('btn-limpiar').addEventListener('click', limpiarFormulario);
});