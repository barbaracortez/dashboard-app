import { useMemo } from "react";
import { Target, Trophy, Scale, TrendingUp } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import ResourcePage from "../components/ResourcePage";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import { ESTADOS, PROBABILIDAD } from "../data/seed";
import { formatDate, formatMoney, formatPercent, sum } from "../utils/format";

const ABIERTAS = ["Prospección", "Propuesta", "Negociación"];

function Pipeline({ items }) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h3>Embudo comercial</h3>
          <p className="card-subtitle">Cantidad y monto por etapa</p>
        </div>
      </div>
      <div className="pipeline">
        {ESTADOS.oportunidades.map((etapa) => {
          const ops = items.filter((o) => o.etapa === etapa);
          return (
            <div key={etapa} className="pipeline-stage">
              <div className="pipeline-head">
                <Badge>{etapa}</Badge>
                <span className="muted small">{ops.length}</span>
              </div>
              <div className="pipeline-amount">{formatMoney(sum(ops, "monto"))}</div>
              <div className="muted small">Prob. {PROBABILIDAD[etapa]}%</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Oportunidades() {
  const collection = useCollection("oportunidades");
  const clientes = useCollection("clientes");
  const items = collection.items;

  const config = useMemo(
    () => ({
      title: "Oportunidades",
      singular: "oportunidad",
      feminine: true,
      subtitle: "Negocios en curso y su avance en el embudo.",
      statusField: "etapa",
      statusOptions: ESTADOS.oportunidades,
      searchKeys: ["titulo", "cliente"],
      defaultSort: { key: "monto", dir: "desc" },
      describe: (o) => o.titulo,
      columns: [
        {
          key: "titulo",
          label: "Oportunidad",
          render: (o) => (
            <div>
              <div className="strong">{o.titulo}</div>
              <div className="muted small">{o.cliente}</div>
            </div>
          ),
        },
        { key: "monto", label: "Monto", align: "right", render: (o) => formatMoney(o.monto) },
        {
          key: "probabilidad",
          label: "Probabilidad",
          render: (o) => (
            <div className="progress">
              <div className="progress-track" aria-hidden="true">
                <div className="progress-bar" style={{ width: `${o.probabilidad}%` }} />
              </div>
              <span>{o.probabilidad}%</span>
            </div>
          ),
          csvValue: (o) => o.probabilidad,
        },
        { key: "fechaCierre", label: "Cierre", render: (o) => <span className="muted">{formatDate(o.fechaCierre)}</span> },
        { key: "etapa", label: "Etapa", render: (o) => <Badge>{o.etapa}</Badge> },
      ],
      fields: [
        { name: "titulo", label: "Título", required: true, full: true, placeholder: "Ej. Licencias Enterprise" },
        {
          name: "cliente", label: "Cliente", type: "select", required: true,
          options: clientes.items.map((c) => c.empresa).sort((a, b) => a.localeCompare(b, "es")),
        },
        { name: "monto", label: "Monto (US$)", type: "number", required: true, min: 0 },
        {
          name: "etapa", label: "Etapa", type: "select", required: true, options: ESTADOS.oportunidades,
          onChange: (_f, v) => (v in PROBABILIDAD ? { probabilidad: PROBABILIDAD[v] } : {}),
        },
        { name: "probabilidad", label: "Probabilidad (%)", type: "number", min: 0 },
        { name: "fechaCierre", label: "Cierre estimado", type: "date", required: true },
      ],
      empty: () => ({ titulo: "", cliente: "", monto: "", etapa: "Prospección", probabilidad: 20, fechaCierre: "" }),
      toRecord: (f) => ({ ...f, monto: Number(f.monto), probabilidad: Math.min(100, Number(f.probabilidad) || 0) }),
    }),
    [clientes.items]
  );

  const abiertas = items.filter((o) => ABIERTAS.includes(o.etapa));
  const ganadas = items.filter((o) => o.etapa === "Ganada");
  const perdidas = items.filter((o) => o.etapa === "Perdida");
  const ponderado = abiertas.reduce((acc, o) => acc + (o.monto * o.probabilidad) / 100, 0);
  const winRate = ganadas.length + perdidas.length ? (ganadas.length / (ganadas.length + perdidas.length)) * 100 : 0;

  const kpis = (
    <>
      <StatCard label="Pipeline abierto" value={formatMoney(sum(abiertas, "monto"))} icon={Target} hint={`${abiertas.length} oportunidades`} loading={collection.loading} />
      <StatCard label="Forecast ponderado" value={formatMoney(ponderado)} icon={TrendingUp} hint="monto × probabilidad" loading={collection.loading} />
      <StatCard label="Ganadas" value={formatMoney(sum(ganadas, "monto"))} icon={Trophy} hint={`${ganadas.length} negocios cerrados`} loading={collection.loading} />
      <StatCard label="Tasa de cierre" value={formatPercent(winRate)} icon={Scale} hint={`${ganadas.length} ganadas · ${perdidas.length} perdidas`} loading={collection.loading} />
    </>
  );

  return (
    <ResourcePage collection={collection} config={config} kpis={kpis}>
      {!collection.loading && <Pipeline items={items} />}
    </ResourcePage>
  );
}
