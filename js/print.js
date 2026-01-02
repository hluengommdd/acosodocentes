document.addEventListener('DOMContentLoaded', function() {
    const data = JSON.parse(localStorage.getItem('informeCaso'));

    if (data) {
        document.getElementById('p_establecimiento').textContent = data.establecimiento || 'No especificado';
        document.getElementById('p_estudiante').textContent = data.estudiante || 'No especificado';
        document.getElementById('p_curso').textContent = data.curso || 'No especificado';
        document.getElementById('p_fecha').textContent = data.fecha || 'No especificada';
        document.getElementById('p_descripcion').textContent = data.descripcion || 'Sin descripción registrada.';
    } else {
        alert('No hay datos guardados. Por favor complete el formulario primero.');
    }
});