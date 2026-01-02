const fs = require('fs');
const { JSDOM } = require('jsdom');

(async () => {
  try {
    const html = fs.readFileSync('./index.html', 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    // Wait briefly for scripts to execute
    await new Promise((r) => setTimeout(r, 200));

    const { document, window } = dom.window;

    // Helper to click a radio by name and value
    function pickRadio(name, value) {
      const radios = Array.from(document.getElementsByName(name));
      const r = radios.find((el) => el.value.trim() === String(value));
      if (r) r.checked = true;
    }

    // Helper to check the first checkbox with given name
    function checkFirst(name) {
      const cb = document.querySelector(`input[name="${name}"]`);
      if (cb) cb.checked = true;
    }

    // Select sample responses: c1=3, c2=2
    pickRadio('c1', 3);
    pickRadio('c2', 2);

    // Select one contexto and one impacto
    checkFirst('contexto');
    checkFirst('impacto');

    // Call calcularTotal if available
    if (typeof window.calcularTotal === 'function') {
      window.calcularTotal();
    } else {
      console.error('calcularTotal not found');
      process.exit(2);
    }

    // Read total
    const totalText = document.getElementById('total') && document.getElementById('total').textContent;
    console.log('TOTAL:', totalText);

    // Expected: 3 + 2 + 1 (contexto) + 1 (impacto) = 7
    if (String(totalText).trim() === '7') {
      console.log('TEST PASSED');
      process.exit(0);
    } else {
      console.error('TEST FAILED: unexpected total');
      process.exit(1);
    }
  } catch (err) {
    console.error('ERROR', err);
    process.exit(3);
  }
})();
