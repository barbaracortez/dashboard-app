const NBSP = " "; // evita que "US$" y el número queden en líneas distintas
const integer = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

/**
 * Formato único de moneda para toda la app.
 *   formatMoney(15440)                    -> "US$ 15.440"
 *   formatMoney(8000, { compact: true })  -> "US$ 8 k"
 *   formatMoney(297290, { compact: true })-> "US$ 297,3 k"
 *   formatMoney(1.5e6, { compact: true }) -> "US$ 1,5 M"
 * El modo compacto se arma a mano (no con notation: "compact") porque Intl en
 * es-AR usa "K" mayúscula entre 1.000 y 9.999 y "k" minúscula desde 10.000.
 */
export function formatMoney(value, { compact = false } = {}) {
  const n = Number(value) || 0;
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  let body;

  if (compact && Math.round(abs / 1e5) / 10 >= 1) {
    body = `${oneDecimal.format(abs / 1e6)}${NBSP}M`;
  } else if (compact && Math.round(abs) >= 1000) {
    body = `${oneDecimal.format(abs / 1e3)}${NBSP}k`;
  } else {
    body = integer.format(Math.round(abs));
  }
  return `${sign}US$${NBSP}${body}`;
}

export const formatNumber = (n) => new Intl.NumberFormat("es-AR").format(Number(n) || 0);
export const formatPercent = (n) => `${Math.round(Number(n) || 0)}%`;

// Las fechas se guardan como "YYYY-MM-DD"; se parsean como fecha local.
export const parseDate = (s) => {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const formatDate = (s) =>
  s
    ? parseDate(s).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const sum = (items, key) => items.reduce((acc, x) => acc + (Number(x[key]) || 0), 0);

// Variación porcentual entre dos valores (null si no hay base)
export const delta = (current, previous) => (previous ? ((current - previous) / previous) * 100 : null);

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
