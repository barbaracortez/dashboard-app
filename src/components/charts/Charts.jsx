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
import { formatCompactMoney } from "../../utils/format";

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

// Serie temporal de una sola métrica
export function TrendChart({ data, dataKey, name, format = formatCompactMoney, height = 280 }) {
  const { chart } = useTheme();
  const color = chart.series[0];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={chart.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: chart.axis }} tick={axisTick(chart)} />
        <YAxis tickLine={false} axisLine={false} tick={axisTick(chart)} tickFormatter={format} width={72} />
        <Tooltip
          cursor={{ stroke: chart.axis, strokeWidth: 1 }}
          content={<ChartTooltip format={format} />}
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
export function HBarChart({ data, dataKey, name, format, height }) {
  const { chart } = useTheme();
  const h = height ?? Math.max(160, data.length * 40);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }} barCategoryGap={8}>
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
        <Tooltip cursor={{ fill: chart.grid, opacity: 0.5 }} content={<ChartTooltip format={format} />} />
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
