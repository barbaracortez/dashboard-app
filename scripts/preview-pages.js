// Servidor estático que imita a GitHub Pages para probar el build de `npm run build:pages`.
// A diferencia de `vite preview` (que responde 200 en cualquier ruta), acá:
//   /dashboard-app/ventas    -> dist/ventas.html  (200)
//   /dashboard-app/no-existe -> dist/404.html     (404)
// Uso: npm run preview:pages  ->  http://localhost:4174/dashboard-app/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "/dashboard-app/";
const PORT = 4174;
const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function send(res, status, file) {
  res.writeHead(status, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  if (pathname === BASE.slice(0, -1)) {
    res.writeHead(301, { Location: BASE }).end();
    return;
  }
  if (!pathname.startsWith(BASE)) return send(res, 404, join(dist, "404.html"));

  const rel = normalize(decodeURIComponent(pathname.slice(BASE.length))).replace(/^(\.\.[/\\])+/, "");
  // Mismo orden de resolución que GitHub Pages: archivo exacto, <ruta>.html, <ruta>/index.html
  for (const candidate of [rel, `${rel}.html`, join(rel, "index.html")]) {
    const file = join(dist, candidate);
    if (await isFile(file)) return send(res, 200, file);
  }
  return send(res, 404, join(dist, "404.html"));
}).listen(PORT, () => console.log(`Simulando GitHub Pages en http://localhost:${PORT}${BASE}`));
