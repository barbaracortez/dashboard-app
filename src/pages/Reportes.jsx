import { FileText, FileCheck2, FileClock, Users } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import ResourcePage from "../components/ResourcePage";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import { ESTADOS } from "../data/seed";
import { formatDate, formatNumber, todayIso } from "../utils/format";

const TIPOS = ["Ventas", "Pipeline", "Clientes", "Marketing", "Finanzas"];

const config = {
  title: "Reportes",
  singular: "reporte",
  subtitle: "Informes periódicos del área comercial.",
  statusField: "estado",
  statusOptions: ESTADOS.reportes,
  searchKeys: ["nombre", "tipo", "responsable"],
  defaultSort: { key: "fecha", dir: "desc" },
  describe: (r) => `el reporte "${r.nombre}"`,
  columns: [
    { key: "nombre", label: "Reporte", render: (r) => <span className="strong">{r.nombre}</span> },
    { key: "tipo", label: "Área" },
    { key: "responsable", label: "Responsable" },
    { key: "fecha", label: "Fecha", render: (r) => <span className="muted">{formatDate(r.fecha)}</span> },
    { key: "estado", label: "Estado", render: (r) => <Badge>{r.estado}</Badge> },
  ],
  fields: [
    { name: "nombre", label: "Nombre", required: true, full: true },
    { name: "tipo", label: "Área", type: "select", required: true, options: TIPOS },
    { name: "responsable", label: "Responsable", required: true },
    { name: "fecha", label: "Fecha", type: "date", required: true },
    { name: "estado", label: "Estado", type: "select", required: true, options: ESTADOS.reportes },
  ],
  empty: () => ({ nombre: "", tipo: "", responsable: "", fecha: todayIso(), estado: "Pendiente" }),
};

export default function Reportes() {
  const collection = useCollection("reportes");
  const items = collection.items;
  const count = (estado) => items.filter((r) => r.estado === estado).length;

  const kpis = (
    <>
      <StatCard label="Reportes" value={formatNumber(items.length)} icon={FileText} loading={collection.loading} />
      <StatCard label="Generados" value={formatNumber(count("Generado"))} icon={FileCheck2} loading={collection.loading} />
      <StatCard label="En revisión / pendientes" value={formatNumber(count("En revisión") + count("Pendiente"))} icon={FileClock} loading={collection.loading} />
      <StatCard label="Responsables" value={formatNumber(new Set(items.map((r) => r.responsable)).size)} icon={Users} loading={collection.loading} />
    </>
  );

  return <ResourcePage collection={collection} config={config} kpis={kpis} />;
}
