import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, Target, Users, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCollection } from "../hooks/useCollection";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import { HBarChart, TrendChart } from "../components/charts/Charts";
import { groupSum, ingresos, monthlyRevenue, ventasDelMes, ventasMesAnteriorAlDia } from "../utils/analytics";
import { delta, formatDate, formatMoney, formatNumber, formatPercent, sum } from "../utils/format";

const moneyCompact = (v) => formatMoney(v, { compact: true });
import { ESTADOS } from "../data/seed";

const ABIERTAS = ["Prospección", "Propuesta", "Negociación"];

function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`card chart-card ${className}`}>
      <div className="card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const ventas = useCollection("ventas");
  const oportunidades = useCollection("oportunidades");
  const leads = useCollection("leads");
  const clientes = useCollection("clientes");
  const loading = ventas.loading || oportunidades.loading || leads.loading || clientes.loading;

  const stats = useMemo(() => {
    const mes = ventasDelMes(ventas.items, 0);
    const prev = ventasMesAnteriorAlDia(ventas.items);
    const abiertas = oportunidades.items.filter((o) => ABIERTAS.includes(o.etapa));
    const ganadas = oportunidades.items.filter((o) => o.etapa === "Ganada").length;
    const perdidas = oportunidades.items.filter((o) => o.etapa === "Perdida").length;
    return {
      ingresosMes: ingresos(mes),
      ingresosDelta: delta(ingresos(mes), ingresos(prev)),
      ventasMes: mes.filter((v) => v.estado !== "Cancelada").length,
      ventasDelta: delta(mes.filter((v) => v.estado !== "Cancelada").length, prev.filter((v) => v.estado !== "Cancelada").length),
      pipeline: sum(abiertas, "monto"),
      abiertas: abiertas.length,
      winRate: ganadas + perdidas ? (ganadas / (ganadas + perdidas)) * 100 : 0,
      clientesActivos: clientes.items.filter((c) => c.estado === "Activo").length,
      clientesTotal: clientes.items.length,
    };
  }, [ventas.items, oportunidades.items, clientes.items]);

  const revenue = useMemo(() => monthlyRevenue(ventas.items), [ventas.items]);
  const totalAnual = sum(revenue, "ingresos");

  const pipelinePorEtapa = useMemo(
    () =>
      ABIERTAS.map((etapa) => ({
        label: etapa,
        value: sum(oportunidades.items.filter((o) => o.etapa === etapa), "monto"),
      })),
    [oportunidades.items]
  );

  const leadsPorFuente = useMemo(() => groupSum(leads.items, "fuente"), [leads.items]);
  const ultimasVentas = ventas.items.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);

  const hour = new Date().getHours();
  const saludo = hour < 12 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="page">
      <PageHeader
        title={`${saludo}, ${user?.nombre?.split(" ")[0] ?? ""}`}
        subtitle="Este es el resumen de tu actividad comercial."
      />

      <div className="kpi-grid">
        <StatCard label="Ingresos del mes" value={formatMoney(stats.ingresosMes)} icon={DollarSign} change={stats.ingresosDelta} hint="vs. mismo período del mes anterior" loading={loading} />
        <StatCard label="Ventas del mes" value={formatNumber(stats.ventasMes)} icon={ShoppingCart} change={stats.ventasDelta} hint="vs. mismo período del mes anterior" loading={loading} />
        <StatCard label="Pipeline abierto" value={formatMoney(stats.pipeline)} icon={Target} hint={`${stats.abiertas} oportunidades · ${formatPercent(stats.winRate)} de cierre`} loading={loading} />
        <StatCard label="Clientes activos" value={formatNumber(stats.clientesActivos)} icon={Users} hint={`de ${stats.clientesTotal} registrados`} loading={loading} />
      </div>

      <div className="grid-2-1">
        <ChartCard title="Ingresos mensuales" subtitle={`Ventas completadas · últimos 12 meses cerrados · ${moneyCompact(totalAnual)} en total`}>
          {loading ? <div className="skeleton skeleton-chart" /> : <TrendChart data={revenue} dataKey="ingresos" name="Ingresos" />}
        </ChartCard>
        <ChartCard title="Pipeline por etapa" subtitle="Monto de oportunidades abiertas" action={<Link className="link" to="/oportunidades">Ver <ArrowRight size={14} /></Link>}>
          {loading ? <div className="skeleton skeleton-chart" /> : <HBarChart data={pipelinePorEtapa} dataKey="value" name="Monto" format={moneyCompact} tooltipFormat={formatMoney} height={200} />}
        </ChartCard>
      </div>

      <div className="grid-2-1">
        <section className="card">
          <div className="card-header">
            <div>
              <h3>Últimas ventas</h3>
              <p className="card-subtitle">Movimientos más recientes</p>
            </div>
            <Link className="link" to="/ventas">Ver todas <ArrowRight size={14} /></Link>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j}><div className="skeleton skeleton-text" /></td>
                        ))}
                      </tr>
                    ))
                  : ultimasVentas.map((v) => (
                      <tr key={v.id}>
                        <td className="strong">{v.cliente}</td>
                        <td>{v.producto}</td>
                        <td className="muted">{formatDate(v.fecha)}</td>
                        <td><Badge>{v.estado}</Badge></td>
                        <td className="num">{formatMoney(v.total)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </section>

        <ChartCard title="Leads por fuente" subtitle={`${leads.items.length} leads · ${leads.items.filter((l) => l.estado === ESTADOS.leads[0]).length} sin contactar`} action={<Link className="link" to="/leads">Ver <ArrowRight size={14} /></Link>}>
          {loading ? <div className="skeleton skeleton-chart" /> : <HBarChart data={leadsPorFuente} dataKey="value" name="Leads" format={formatNumber} />}
        </ChartCard>
      </div>
    </div>
  );
}
