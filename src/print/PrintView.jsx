import React, {useEffect, useMemo, useState} from 'react'
import html2pdf from 'html2pdf.js'

function getTiempoColegio(valor){
  const map = {
    'menos_1_anio':'Menos de 1 año',
    '1_2_anios':'Entre 1 y 2 años',
    'mas_2_anios':'Más de 2 años'
  }
  return map[valor]||'No especificado'
}

function valorAFrecuencia(valor){
  const valores={ '0':'Nunca','1':'Una o dos veces','2':'Varias veces al mes','3':'Una o más veces a la semana','4':'Varias veces a la semana' }
  return valores[valor]||'No respondido'
}

function SafeText({children}){
  if (!children) return null
  const parts = String(children).split('\n')
  return parts.map((p,i)=> i===parts.length-1 ? p : [p, <br key={i}/>])
}

export default function PrintView(){
  const [data,setData] = useState(null)

  useEffect(()=>{
    try{
      const stored = JSON.parse(sessionStorage.getItem('printData') || '{}')
      const hasData = Object.keys(stored||{}).length>0
      const example = { curso:'6° A', edad:'11', sexo:['Femenino'], tiempo_colegio:'1_2_anios', pregunta_1:'1', espacio_historia:'Aquí va un ejemplo de historia.\nSegunda línea.' }
      setData(hasData?stored:example)
    }catch(e){
      setData({})
    }
  },[])

  const fechaEmision = useMemo(()=> new Date().toLocaleDateString('es-CL',{year:'numeric',month:'2-digit',day:'2-digit'}),[])
  const horaEmision = useMemo(()=> new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}),[])

  if (!data) return <div>Cargando...</div>

  const doSavePdf = async ()=>{
    const element = document.getElementById('printContent')
    const fecha = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')
    const opt = { margin:[10,10,15,10], filename:`OBVQ-${fecha}.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} }
    try{
      await html2pdf().set(opt).from(element).save()
    }catch(e){
      console.error('html2pdf error',e)
      window.print()
    }
  }

  const doPrint = ()=> window.print()

  const doClose = ()=>{
    try{
      if (window.opener || window.self !== window.top) window.close()
      else alert('No se puede cerrar automáticamente. Cierra la pestaña manualmente.')
    }catch(e){ alert('No fue posible cerrar la ventana automáticamente.') }
  }

  return (
    <div>
      <div id="printContent" className="print-document print-shell">
        <header className="print-header">
          <div className="header-left">
            <h1 className="print-page-title">CUESTIONARIO DE EXPERIENCIAS EN LA ESCUELA OBVQ-R</h1>
            <div className="print-page-subtitle">Colegio Carmera Romero de Espinoza - MMDD Concepción</div>
            <div className="print-page-date">Fecha de aplicación: {fechaEmision} | Hora: {horaEmision}</div>
          </div>
          <div className="header-right">
            <img className="print-header__logo" src="/logo-oficial.png" alt="Logo" />
          </div>
        </header>

        <div className="print-body">
          <div className="info-section">
            <h3>Información General del Estudiante</h3>
            <div className="info-grid">
              <div><strong>Curso:</strong> <SafeText>{data.curso||'No especificado'}</SafeText></div>
              <div><strong>Edad:</strong> <SafeText>{data.edad||'No especificada'}</SafeText> años</div>
              <div><strong>Sexo:</strong> <SafeText>{Array.isArray(data.sexo)&&data.sexo.length>0?data.sexo.join(', '):'No especificado'}</SafeText></div>
              <div><strong>Tiempo en el colegio:</strong> <SafeText>{getTiempoColegio(data.tiempo_colegio)}</SafeText></div>
            </div>
          </div>

          <section className="section">
            <h3>PREGUNTA GENERAL</h3>
            <div className="pregunta-item">
              <div className="pregunta-texto">1. ¿Con qué frecuencia has sido acosado en la escuela?</div>
              <div className="respuesta-valor">→ {valorAFrecuencia(data.pregunta_1)}</div>
            </div>
          </section>

          <Section title="SECCIÓN A: INSULTOS Y BURLAS" preguntas={[
            'Me han llamado con nombres feos, me han burlado de mí o me han bromeado de forma hiriente',
            'Me han dicho que soy poco atractivo, que soy feo o que mi cuerpo no es bonito',
            'Me han insultado por mi raza, color de piel o donde vengo',
            'Me han insultado por mis creencias religiosas',
            'Me han hecho comentarios desagradables sobre mis gustos o mis características',
            'Me han hecho bromas sobre mi forma de hablar, mi acento o porque soy de otro país'
          ]} data={data} startNum={2} />

          <Section title="SECCIÓN B: EXCLUSIÓN Y RECHAZO SOCIAL" preguntas={[
            'Me han dejado fuera de sus juegos o actividades a propósito',
            'Me han dicho que no puedo jugar con ellos',
            'Me han ignorado completamente o no me hablan',
            'Me han prohibido a otros que jueguen conmigo o sean mis amigos',
            'Otros estudiantes desaparecen o se van cuando llego',
            'Me han hablado mal con otros estudiantes para que no quieran estar conmigo',
            'Me han excluido de chats de WhatsApp, juegos online o redes sociales'
          ]} data={data} startNum={8} />

          <Section title="SECCIÓN C: AGRESIÓN FÍSICA" preguntas={[
            'Me han golpeado, pateado o empujado',
            'Me han jalado del pelo o arañado',
            'Me han encerrado en algún lugar',
            'Me han aventado cosas (pelotas, piedras, cuadernos, etc.)'
          ]} data={data} startNum={15} />

          <Section title="SECCIÓN D: DAÑO A PERTENENCIAS" preguntas={[
            'Me han robado dinero u otras cosas',
            'Me han roto o dañado a propósito mis cosas (mochilas, útiles, ropa, etc.)',
            'Me han sacado mis cosas sin permiso o las han dañado'
          ]} data={data} startNum={19} />

          <Section title="SECCIÓN E: AMENAZAS E INTIMIDACIÓN" preguntas={[
            'Me han amenazado o intimidado',
            'Me han obligado a hacer cosas que no quería hacer',
            'Me han dicho que van a contarles a otros algo malo de mí'
          ]} data={data} startNum={22} />

          <Section title="SECCIÓN F: ACOSO POR MEDIOS DIGITALES" preguntas={[
            'Me han molestado usando celulares (mensajes, fotos, videos)',
            'Me han molestado usando internet o redes sociales (Facebook, WhatsApp, TikTok, etc.)',
            'Me han enviado mensajes o comentarios desagradables'
          ]} data={data} startNum={25} />

          <Section title="SECCIÓN G: OTROS TIPOS DE ACOSO" preguntas={[
            'Me han tocado de forma desagradable o inapropiada',
            'Me han hecho comentarios de naturaleza sexual que me incomodan',
            'Me han molestado, excluido o acosado por tener autismo, TDAH, dislexia u otra diferencia en cómo aprendo o me comporto',
            'Me han molestado o excluido por venir de otro país, mi acento, o porque soy extranjero/a',
            'Me han acosado por mi identidad de género, orientación sexual u otra característica personal'
          ]} data={data} startNum={28} />

          <div className="section"><h3>INFORMACIÓN ADICIONAL</h3>
            {data.inicio_acoso && <p><strong>¿Cuándo comenzó el acoso?</strong> <SafeText>{data.inicio_acoso}</SafeText></p>}
            {data.grupo_cantidad && <p><strong>Cantidad de molestadores:</strong> <SafeText>{data.grupo_cantidad}</SafeText> estudiantes</p>}
            {data.grupo_nombres && data.grupo_nombres.trim() && <div><strong>Nombres:</strong><div className="text-response"><SafeText>{data.grupo_nombres}</SafeText></div></div>}
          </div>

          {Array.isArray(data.sentimientos) && data.sentimientos.length>0 && (
            <div className="section"><h3>CÓMO SE SIENTE</h3><ul className="lista-items">{data.sentimientos.map((s,i)=><li key={i}><SafeText>{s}</SafeText></li>)}</ul></div>
          )}

          {data.espacio_historia && data.espacio_historia.trim() && (
            <div className="section"><h3>ESPACIO PARA CONTAR SU HISTORIA</h3><div className="text-response"><SafeText>{data.espacio_historia}</SafeText></div></div>
          )}

          <footer className="print-footer">Documento confidencial - Para uso interno del Equipo de Convivencia Escolar<br/>Generado automáticamente el {fechaEmision} a las {horaEmision}</footer>
        </div>
      </div>

      <div id="printControls" style={{position:'fixed',right:18,top:18,zIndex:9999,display:'flex',gap:8}}>
        <button id="doPrint" aria-label="Guardar PDF" onClick={doSavePdf}>Guardar PDF</button>
        <button id="doPrintDialog" aria-label="Imprimir" onClick={doPrint}>Imprimir</button>
        <button id="closeWindow" aria-label="Cerrar ventana" onClick={doClose}>Cerrar</button>
      </div>
    </div>
  )
}

function Section({title,preguntas,data,startNum}){
  return (
    <div className="section">
      <h3>{title}</h3>
      {preguntas.map((text,idx)=>{
        const num = startNum + idx
        return (
          <div className="pregunta-item" key={num}>
            <div className="pregunta-texto">{num}. {text}</div>
            <div className="respuesta-valor">→ {valorAFrecuencia(data[`pregunta_${num}`])}</div>
          </div>
        )
      })}
    </div>
  )
}
