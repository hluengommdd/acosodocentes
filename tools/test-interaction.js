const { JSDOM } = require('jsdom');
const path = require('path');

(async () => {
  const filePath = path.resolve(__dirname, '..', 'index.html');
  try {
    const dom = await JSDOM.fromFile(filePath, { runScripts: 'dangerously', resources: 'usable' });

    // Wait for scripts to load
    await new Promise((resolve, reject) => {
      const doc = dom.window.document;
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for page to load scripts')), 2000);
      if (doc.readyState === 'complete') {
        clearTimeout(timeout);
        return resolve();
      }
      dom.window.addEventListener('load', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    const w = dom.window;
    const d = w.document;

    // Select inputs to produce a known total: c1=3, c2=2, one contexto, one impacto => total 7
    const c1 = d.querySelector('input[name="c1"][value="3"]');
    const c2 = d.querySelector('input[name="c2"][value="2"]');
    if (!c1 || !c2) throw new Error('Required inputs not found in DOM');

    c1.checked = true;
    c2.checked = true;

    const contexto = d.querySelectorAll('input[name="contexto"]');
    const impacto = d.querySelectorAll('input[name="impacto"]');
    if (contexto.length === 0 || impacto.length === 0) throw new Error('Contexto/impacto inputs not found');
    contexto[0].checked = true;
    impacto[0].checked = true;

    // Call calcularTotal
    if (typeof w.calcularTotal !== 'function') throw new Error('calcularTotal() not defined');
    w.calcularTotal();

    const totalText = d.getElementById('total').textContent.trim();
    console.log('TOTAL:', totalText);

    if (totalText === '7') {
      console.log('TEST PASSED');
      process.exit(0);
    } else {
      console.error('TEST FAILED: unexpected total');
      process.exit(2);
    }
  } catch (err) {
    console.error('ERROR RUNNING TEST:', err && err.stack ? err.stack : err);
    process.exit(3);
  }
})();
