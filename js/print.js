document.addEventListener('DOMContentLoaded', function() {
    // Prefer sessionStorage.printData (set by the main form), fall back to localStorage.printData or older key 'informeCaso'
    function readStored() {
        try { const s = sessionStorage.getItem('printData'); if (s) return JSON.parse(s); } catch(e){}
        try { const l = localStorage.getItem('printData'); if (l) return JSON.parse(l); } catch(e){}
        try { const old = localStorage.getItem('informeCaso'); if (old) return JSON.parse(old); } catch(e){}
        return null;
    }

    const data = readStored();

    // If no data, use safe defaults (do not show blocking alert)
    const defaults = { establecimiento: 'No especificado', estudiante: 'No especificado', curso: 'No especificado', fecha: 'No especificada', descripcion: 'Sin descripción registrada.' };
    const use = data || defaults;

    document.getElementById('p_establecimiento').textContent = use.establecimiento || defaults.establecimiento;
    document.getElementById('p_estudiante').textContent = use.estudiante || defaults.estudiante;
    document.getElementById('p_curso').textContent = use.curso || defaults.curso;
    document.getElementById('p_fecha').textContent = use.fecha || defaults.fecha;
    document.getElementById('p_descripcion').textContent = use.descripcion || defaults.descripcion;
});