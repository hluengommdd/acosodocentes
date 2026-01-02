# Vite + React print view

Runs a small React app that reproduces the institutional print view and PDF export.

Install and run:

```bash
cd /workspaces/acosodocentes
npm install
npm run dev
```

Open http://localhost:4173

Notes:
- The app reads `sessionStorage.printData` (object) to populate the view. If empty, it shows example data.
- PDF export uses `html2pdf.js` (installed dependency).
