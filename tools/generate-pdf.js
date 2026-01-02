import puppeteer from 'puppeteer'

(async ()=>{
  const out = new URL('../obvq-test.pdf', import.meta.url).pathname
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']})
  const page = await browser.newPage()
  // Inject printData into sessionStorage before any script runs on the page
  const payload = {
    curso: '6° A',
    edad: '11',
    sexo: ['Femenino'],
    tiempo_colegio: '1_2_anios',
    pregunta_1: '2',
    espacio_historia: 'Prueba PDF generada automáticamente.'
  }
  await page.evaluateOnNewDocument((p) => {
    try { sessionStorage.setItem('printData', JSON.stringify(p)) } catch (e) { /* ignore */ }
  }, payload)
  await page.goto('http://127.0.0.1:4173/print.html', {waitUntil:'networkidle2', timeout: 60000})
  await page.waitForSelector('#printContent', {timeout:15000})
  // small delay to allow images/CSS to settle (use setTimeout for compatibility)
  await new Promise((res) => setTimeout(res, 1000))
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: {top:'10mm',bottom:'15mm',left:'10mm',right:'10mm'}
  })
  await browser.close()
  console.log('PDF generado:', out)
})().catch(e=>{ console.error(e); process.exit(1) })
