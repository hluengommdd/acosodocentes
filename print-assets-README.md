# Paquete de impresión (generado)

Estos assets contienen la vista de impresión y estilos mínimos necesarios para generar PDFs.

Contenido:
- `print.html` – vista de impresión (en la raíz del repo)
- `logo-oficial.png` – placeholder: reemplazar por el logo real
- `print-styles/css/print.css` y `print-styles/css/print-variables.css`
- `print-styles/js/html2pdf.bundle.min.js` – loader que descarga la librería desde CDN
- `print-styles/js/print-utils.js`

Notas:
- Reemplaza `logo-oficial.png` por la imagen institucional (mismo nombre/ubicación) para que se muestre correctamente.
- Si necesitas que `html2pdf` esté disponible offline, descarga el bundle real y sobrescribe `print-styles/js/html2pdf.bundle.min.js`.
- Para probar localmente:

```bash
python3 -m http.server 4173
# abrir http://localhost:4173/print.html
```
