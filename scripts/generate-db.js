// Genera db.json para json-server con los mismos datos de demostración que usa el modo demo.
// Uso: npm run db:seed
import { writeFileSync } from "node:fs";
import { generateSeed } from "../src/data/seed.js";

const out = new URL("../db.json", import.meta.url);
writeFileSync(out, JSON.stringify(generateSeed(), null, 2) + "\n");
console.log("db.json generado");
