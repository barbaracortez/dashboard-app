import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { formatMoney } from "../../utils/format";

const moneyCompact = (v) => formatMoney(v, { compact: true });
const moneyFull = (v) => formatMoney(v);

function ChartTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label ?? p.payload.label}</div>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-swatch" style={{ background: p.color || p.fill }} />
        <span>{p.name}</span>
        <strong>{format(p.value)}</strong>
      </div>
    </div>
  );
}

const axisTick = (chart) => ({ fill: chart.muted, fontSize: 12 });

const NARROW_QUERY = "(max-width: 520px)";
const subscribeNarrow = (cb) => {
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useNarrow = () => useSyncExternalStore(subscribeNarrow, () => window.matchMedia(NARROW_QUERY).matches);

// Etiqueta de mes. Las etiquetas vienen como "Sep 2026".
// - Normal: "Sep" y, solo en el primer punto y en enero, el año en una segunda línea.
// - Angosto: inclinada 45° para que las 12 entren sin superponerse ("Ene 26" donde cambia el año).
function MonthTick({ x, y, payload, fill, narrow }) {
  const [mes, anio] = String(payload.value).split(" ");
  const showYear = payload.index === 0 || mes === "Ene";
  if (narrow) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={10} textAnchor="end" transform="rotate(-45)" fill={fill} fontSize={11}>
          {showYear ? `${mes} ${anio.slice(2)}` : mes}
        </text>
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={14} textAnchor="middle" fill={fill} fontSize={12}>
        {mes}
      </text>
      {showYear && (
        <text dy={29} textAnchor="middle" fill={fill} fontSize={11}>
          {anio}
        </text>
      )}
    </g>
  );
}

// Serie temporal mensual de una sola métrica.
// axisFormat: valores del eje Y (compacto); tooltipFormat: valor exacto al pasar el cursor.
export function TrendChart({ data, dataKey, name, axisFormat = moneyCompact, tooltipFormat = moneyFull, height = 280 }) {
  const { chart } = useTheme();
  const narrow = useNarrow();
  const color = chart.series[0];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={chart.grid} />
        {/* interval={0}: mostrar siempre las 12 etiquetas (por defecto Recharts oculta las que se superponen) */}
        <XAxis
          dataKey="label"
          interval={0}
          height={narrow ? 48 : 40}
          padding={{ left: 12, right: 12 }}
          tickLine={false}
          axisLine={{ stroke: chart.axis }}
          tick={<MonthTick fill={chart.muted} narrow={narrow} />}
        />
        <YAxis tickLine={false} axisLine={false} tick={axisTick(chart)} tickFormatter={axisFormat} width={64} />
        <Tooltip
          cursor={{ stroke: chart.axis, strokeWidth: 1 }}
          content={<ChartTooltip format={tooltipFormat} />}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color}
          strokeWidth={2}
          fill="url(#trendFill)"
          activeDot={{ r: 5, strokeWidth: 2, stroke: chart.surface }}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Barras horizontales de una sola métrica (ranking / categorías)
// format: etiqueta junto a cada barra; tooltipFormat: valor exacto (por defecto, el mismo).
export function HBarChart({ data, dataKey, name, format, tooltipFormat = format, height }) {
  const { chart } = useTheme();
  const h = height ?? Math.max(160, data.length * 40);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 80, left: 0, bottom: 0 }} barCategoryGap={8}>
        <CartesianGrid horizontal={false} stroke={chart.grid} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={axisTick(chart)}
          width={110}
        />
        <Tooltip cursor={{ fill: chart.grid, opacity: 0.5 }} content={<ChartTooltip format={tooltipFormat} />} />
        <Bar
          dataKey={dataKey}
          name={name}
          fill={chart.series[0]}
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
          label={{ position: "right", fill: chart.muted, fontSize: 12, formatter: format }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
