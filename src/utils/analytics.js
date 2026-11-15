import { MONTHS, parseDate, sum } from "./format";

const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;

// Ingresos (ventas completadas) agrupados por mes: los últimos `n` meses cerrados.
export function monthlyRevenue(ventas, n = 12, today = new Date()) {
  const buckets = [];
  for (let i = n; i >= 1; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    buckets.push({ key: monthKey(d), label: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, ingresos: 0, ventas: 0 });
  }
  const index = Object.fromEntries(buckets.map((b, i) => [b.key, i]));
  for (const v of ventas) {
    if (v.estado !== "Completada") continue;
    const i = index[monthKey(parseDate(v.fecha))];
    if (i === undefined) continue;
    buckets[i].ingresos += Number(v.total) || 0;
    buckets[i].ventas += 1;
  }
  return buckets;
}

// Ventas del mes calendario con desplazamiento (0 = mes actual, 1 = anterior)
export function ventasDelMes(ventas, offset = 0, today = new Date()) {
  const ref = new Date(today.getFullYear(), today.getMonth() - offset, 1);
  return ventas.filter((v) => {
    const d = parseDate(v.fecha);
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  });
}

// Ventas del mes anterior hasta el mismo día del mes (comparación justa con el mes en curso)
export function ventasMesAnteriorAlDia(ventas, today = new Date()) {
  return ventasDelMes(ventas, 1, today).filter((v) => parseDate(v.fecha).getDate() <= today.getDate());
}

export const completadas = (ventas) => ventas.filter((v) => v.estado === "Completada");

export const ingresos = (ventas) => sum(completadas(ventas), "total");

export function groupSum(items, key, valueKey) {
  const map = new Map();
  for (const it of items) {
    const k = it[key] ?? "—";
    map.set(k, (map.get(k) ?? 0) + (valueKey ? Number(it[valueKey]) || 0 : 1));
  }
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
