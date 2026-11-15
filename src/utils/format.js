const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat("es-AR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatMoney = (n) => currency.format(Number(n) || 0);
export const formatCompactMoney = (n) => `US$ ${compact.format(Number(n) || 0)}`;
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
