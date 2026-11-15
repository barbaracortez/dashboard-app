// Capa de datos.
// - Por defecto funciona en "modo demo": los datos viven en localStorage y se
//   inicializan con datos de ejemplo. No necesita backend, ideal para deploy estático.
// - Si se define VITE_API_URL (ej. http://localhost:5000), usa esa API REST
//   (compatible con json-server).

import { generateSeed } from "../data/seed";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const STORAGE_KEY = "crm-demo-db-v2";
const LATENCY = 250;

export const isDemoMode = !API_URL;

// ---------- Modo remoto ----------
async function http(path, options = {}) {
  const res = await fetch(`${API_URL}/${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Error ${res.status} al llamar a la API`);
  return res.status === 204 ? null : res.json();
}

// ---------- Modo demo ----------
function readDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage no disponible o datos corruptos: se regenera
  }
  const seed = generateSeed();
  writeDb(seed);
  return seed;
}

function writeDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Sin persistencia disponible (modo privado): se trabaja en memoria
  }
  memoryDb = db;
}

let memoryDb = null;
const db = () => memoryDb ?? readDb();
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const local = {
  list: (col) => delay(structuredClone(db()[col] ?? [])),
  create: (col, data) => {
    const current = db();
    const item = { ...data, id: newId() };
    writeDb({ ...current, [col]: [item, ...current[col]] });
    return delay(item);
  },
  update: (col, id, data) => {
    const current = db();
    const item = { ...data, id };
    writeDb({ ...current, [col]: current[col].map((x) => (x.id === id ? item : x)) });
    return delay(item);
  },
  remove: (col, id) => {
    const current = db();
    writeDb({ ...current, [col]: current[col].filter((x) => x.id !== id) });
    return delay(null);
  },
};

const remote = {
  list: (col) => http(col),
  create: (col, data) => http(col, { method: "POST", body: JSON.stringify(data) }),
  update: (col, id, data) => http(`${col}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (col, id) => http(`${col}/${id}`, { method: "DELETE" }),
};

export const api = isDemoMode ? local : remote;

export function resetDemoData() {
  writeDb(generateSeed());
}
