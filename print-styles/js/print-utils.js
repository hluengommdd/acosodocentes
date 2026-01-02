/* Simple print-utils: render printData into #printContent and provide print/pdf controls */
(async function(){
  const data = (function(){
    try{ const d=sessionStorage.getItem('printData'); if(d) return JSON.parse(d); }catch(e){}
    try{ const d=localStorage.getItem('printData'); if(d) return JSON.parse(d); }catch(e){}
    return {};
  })();

  function valorDefault(v,def='No especificado'){ return (v!==undefined && v!==null && (String(v).trim()!==''))?v:def }

  const fechaEmision = new Date().toLocaleDateString('es-CL')
  const horaEmision = new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})

  const logo = '/assets/logo-oficial.png'

  const contextosStr = Array.isArray(data.contextos) && data.contextos.length ? data.contextos.join(', ') : 'No especificado';
  const impactosStr = Array.isArray(data.impactos) && data.impactos.length ? data.impactos.join(', ') : 'No especificado';

  const html = `
    <header class="print-header">
      <div>
        <div class="print-page-title">CUESTIONARIO - INSTRUMENTO DE OBSERVACIÓN</div>
        <div class="print-page-subtitle">${valorDefault(data.establecimiento,'')}</div>
        <div class="print-page-date">Fecha emisión: ${fechaEmision} ${horaEmision}</div>
      </div>
      <div class="header-right"><img src="${logo}" class="print-header__logo" alt="logo"/></div>
    </header>
    <div class="print-body">
      <div class="info-section">
        <h3>Información general</h3>
        <div class="info-grid">
          <div><strong>Establecimiento:</strong> ${valorDefault(data.establecimiento)}</div>
          <div><strong>Docente observador:</strong> ${valorDefault(data.docente)}</div>
          <div><strong>Asignatura:</strong> ${valorDefault(data.asignatura)}</div>
          <div><strong>Estudiante:</strong> ${valorDefault(data.estudiante)}</div>
          <div><strong>Curso:</strong> ${valorDefault(data.curso)}</div>
          <div><strong>Edad:</strong> ${valorDefault(data.edad)}</div>
          <div><strong>Sexo:</strong> ${valorDefault(data.sexo)}</div>
          <div><strong>Período observado:</strong> ${valorDefault(data.fecha_desde,'')}${data.fecha_desde && data.fecha_hasta? ' - ' + data.fecha_hasta : ''}</div>
          <div><strong>Total:</strong> ${valorDefault(data.total)}</div>
          <div><strong>Interpretación:</strong> ${valorDefault(data.interpretacion)}</div>
          <div><strong>Contextos:</strong> ${contextosStr}</div>
          <div><strong>Impactos observados:</strong> ${impactosStr}</div>
        </div>
      </div>

      <div class="section">
        <h3>Detalles por ítem</h3>
        <div class="qa-grid">
          ${Array.isArray(data.items) && data.items.length ? data.items.map(item=>{
            return `<div class="qa-item"><div class="q">${item.question||''}</div><div class="r"><strong>Respuesta:</strong> ${valorDefault(item.response,'No especificado')}</div><div class="obs"><strong>Observación:</strong> ${valorDefault(item.observation,'')}</div></div>`
          }).join('') : '<div>No hay ítems registrados.</div>'}
        </div>
      </div>

      <div class="section">
        <h3>Registro narrativo</h3>
        <div class="text-response">${valorDefault(data.narrativo,'')}</div>
      </div>
    </div>
    <footer class="print-footer">Documento para uso institucional. Generado automáticamente.</footer>`

  const container = document.getElementById('printContent')
  if(container) container.innerHTML = html

  // controls
  const controls = document.createElement('div')
  controls.id = 'printControls'
  controls.innerHTML = '<button id="doPdf">Guardar PDF</button><button id="doPrint">Imprimir</button>'
  document.body.appendChild(controls)

  document.getElementById('doPdf').addEventListener('click', async ()=>{
    const opt = { margin:10, filename:`OBVQ-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} }
    try{
      await html2pdf().set(opt).from(document.getElementById('printContent')).save()
    }catch(err){ console.error(err); window.print(); }
  })
  document.getElementById('doPrint').addEventListener('click', ()=>window.print())

})();
