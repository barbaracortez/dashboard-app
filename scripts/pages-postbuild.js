// Prepara dist/ para GitHub Pages después de `vite build`.
//
// GitHub Pages solo conoce archivos: /dashboard-app/login no existe, así que responde
// 404 (sirviendo 404.html). Para que cada ruta de la app responda 200 sin cambiar
// la URL, se copia index.html como <ruta>.html: Pages sirve /login desde login.html
// sin redirección (con login/index.html redirigiría a /login/).
//
// Las rutas se leen de src/App.jsx para que esta lista no quede desactualizada.
// 404.html se mantiene para rutas desconocidas.
import { copyFileSync, existsSync, readFileSync } from "node:fs";

const dist = new URL("../dist/", import.meta.url);
const index = new URL("index.html", dist);

if (!existsSync(index)) {
  console.error("pages-postbuild: no existe dist/index.html. Corré primero vite build.");
  process.exit(1);
}

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const routes = [...app.matchAll(/<Route\s+path="\/?([a-z][a-z0-9-]*)"/g)].map((m) => m[1]);

if (routes.length === 0) {
  console.error("pages-postbuild: no se encontraron rutas en src/App.jsx.");
  process.exit(1);
}

copyFileSync(index, new URL("404.html", dist));
for (const route of routes) copyFileSync(index, new URL(`${route}.html`, dist));

console.log(`pages-postbuild: 404.html + ${routes.map((r) => `${r}.html`).join(", ")}`);
