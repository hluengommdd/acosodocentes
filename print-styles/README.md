Print template usage

This folder provides a reusable print template and renderer that reuse the project's print styles.

Ways to use the template:

1) sessionStorage/localStorage

  // from the calling platform
  sessionStorage.setItem('printData', JSON.stringify(myData));
  // then open the template
  /print-styles/print-template.html

2) Call `renderPrint` directly (if you open the template and then send data via script)

  // after opening the template in the same window
  window.renderPrint(myData);

3) URL parameter (good for opening in a new tab/window)

  // URI-encoded JSON
  const u = '/print-styles/print-template.html?data=' + encodeURIComponent(JSON.stringify(myData));
  window.open(u);

  // or Base64-encoded JSON
  const u2 = '/print-styles/print-template.html?data=' + btoa(JSON.stringify(myData));
  window.open(u2);

4) postMessage (send payload from opener to the template)

  const w = window.open('/print-styles/print-template.html');
  // once the window is open, send the data
  w.postMessage({ type: 'render-print', payload: myData }, '*');

Data shape example (keys used by renderer):

{
  "establecimiento": "Colegio Ejemplo",
  "docente": "Nombre Docente",
  "asignatura": "Matemática",
  "estudiante": "Alumno Ejemplo",
  "curso": "6° A",
  "edad": "12",
  "sexo": "M",
  "fecha_desde": "2025-12-01",
  "fecha_hasta": "2025-12-31",
  "total": "12",
  "interpretacion": "✓ ...",
  "contextos": ["Sala de clases","Recreo"],
  "impactos": ["Bajo rendimiento"],
  "firma_nombre": "Nombre Firma",
  "firma_fecha": "2025-12-31",
  "firma_rut": "12.345.678-9",
  "narrativo": "Texto narrativo...",
  "items": [ { "question": "1. Insultos...", "response": "Raramente", "observation": "..." } ]
}

If you want, I can add a small example `example-data.json` or a tiny demo page that sends the data to the template automatically.
