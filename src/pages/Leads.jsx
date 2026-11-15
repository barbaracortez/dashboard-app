import { UserPlus, Sparkles, CheckCircle2, Megaphone } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import ResourcePage from "../components/ResourcePage";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import { ESTADOS, FUENTES } from "../data/seed";
import { groupSum } from "../utils/analytics";
import { formatDate, formatNumber, formatPercent, todayIso } from "../utils/format";

const config = {
  title: "Leads",
  singular: "lead",
  subtitle: "Contactos potenciales en etapa de calificación.",
  statusField: "estado",
  statusOptions: ESTADOS.leads,
  searchKeys: ["nombre", "empresa", "email", "fuente"],
  defaultSort: { key: "fecha", dir: "desc" },
  describe: (l) => `${l.nombre} (${l.empresa})`,
  columns: [
    {
      key: "nombre",
      label: "Contacto",
      render: (l) => (
        <div>
          <div className="strong">{l.nombre}</div>
          <div className="muted small">{l.email}</div>
        </div>
      ),
    },
    { key: "empresa", label: "Empresa" },
    { key: "fuente", label: "Fuente" },
    { key: "fecha", label: "Ingreso", render: (l) => <span className="muted">{formatDate(l.fecha)}</span> },
    { key: "estado", label: "Estado", render: (l) => <Badge>{l.estado}</Badge> },
  ],
  fields: [
    { name: "nombre", label: "Nombre", required: true, placeholder: "Nombre y apellido" },
    { name: "empresa", label: "Empresa", required: true },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "nombre@empresa.com" },
    { name: "fuente", label: "Fuente", type: "select", required: true, options: FUENTES },
    { name: "fecha", label: "Fecha de ingreso", type: "date", required: true },
    { name: "estado", label: "Estado", type: "select", required: true, options: ESTADOS.leads },
  ],
  empty: () => ({ nombre: "", empresa: "", email: "", fuente: "", fecha: todayIso(), estado: "Nuevo" }),
};

export default function Leads() {
  const collection = useCollection("leads");
  const items = collection.items;
  const calificados = items.filter((l) => l.estado === "Calificado").length;
  const topFuente = groupSum(items, "fuente")[0];

  const kpis = (
    <>
      <StatCard label="Leads totales" value={formatNumber(items.length)} icon={UserPlus} loading={collection.loading} />
      <StatCard label="Sin contactar" value={formatNumber(items.filter((l) => l.estado === "Nuevo").length)} icon={Sparkles} hint="requieren seguimiento" loading={collection.loading} />
      <StatCard label="Tasa de calificación" value={formatPercent(items.length ? (calificados / items.length) * 100 : 0)} icon={CheckCircle2} hint={`${calificados} calificados`} loading={collection.loading} />
      <StatCard label="Mejor canal" value={topFuente?.label ?? "—"} icon={Megaphone} hint={topFuente ? `${topFuente.value} leads` : ""} loading={collection.loading} />
    </>
  );

  return <ResourcePage collection={collection} config={config} kpis={kpis} />;
}
