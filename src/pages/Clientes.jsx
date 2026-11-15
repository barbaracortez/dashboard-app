import { Users, UserCheck, UserPlus, MapPin } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import ResourcePage from "../components/ResourcePage";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import { ESTADOS } from "../data/seed";
import { groupSum } from "../utils/analytics";
import { formatDate, formatNumber, initials, parseDate, todayIso } from "../utils/format";

const config = {
  title: "Clientes",
  singular: "cliente",
  subtitle: "Cartera de cuentas y contactos principales.",
  statusField: "estado",
  statusOptions: ESTADOS.clientes,
  searchKeys: ["nombre", "empresa", "email", "ciudad"],
  defaultSort: { key: "empresa", dir: "asc" },
  describe: (c) => c.empresa,
  columns: [
    {
      key: "empresa",
      label: "Empresa",
      render: (c) => (
        <div className="cell-entity">
          <span className="avatar avatar-sm" aria-hidden="true">{initials(c.empresa)}</span>
          <div>
            <div className="strong">{c.empresa}</div>
            <div className="muted small">{c.nombre}</div>
          </div>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (c) => <a className="link" href={`mailto:${c.email}`}>{c.email}</a> },
    { key: "telefono", label: "Teléfono", sortable: false },
    { key: "ciudad", label: "Ciudad" },
    { key: "fechaAlta", label: "Alta", render: (c) => <span className="muted">{formatDate(c.fechaAlta)}</span> },
    { key: "estado", label: "Estado", render: (c) => <Badge>{c.estado}</Badge> },
  ],
  fields: [
    { name: "empresa", label: "Empresa", required: true, placeholder: "Ej. Andes Logística" },
    { name: "nombre", label: "Contacto principal", required: true, placeholder: "Nombre y apellido" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "contacto@empresa.com" },
    { name: "telefono", label: "Teléfono", type: "tel", placeholder: "+54 11 …" },
    { name: "ciudad", label: "Ciudad" },
    { name: "estado", label: "Estado", type: "select", required: true, options: ESTADOS.clientes },
  ],
  empty: () => ({ empresa: "", nombre: "", email: "", telefono: "", ciudad: "", estado: "Activo", fechaAlta: todayIso() }),
};

export default function Clientes() {
  const collection = useCollection("clientes");
  const items = collection.items;
  const hace30 = new Date();
  hace30.setDate(hace30.getDate() - 30);
  const nuevos = items.filter((c) => c.fechaAlta && parseDate(c.fechaAlta) >= hace30).length;
  const topCiudad = groupSum(items, "ciudad")[0];

  const kpis = (
    <>
      <StatCard label="Clientes totales" value={formatNumber(items.length)} icon={Users} loading={collection.loading} />
      <StatCard label="Activos" value={formatNumber(items.filter((c) => c.estado === "Activo").length)} icon={UserCheck} hint={items.length ? `${Math.round((items.filter((c) => c.estado === "Activo").length / items.length) * 100)}% de la cartera` : ""} loading={collection.loading} />
      <StatCard label="Altas últimos 30 días" value={formatNumber(nuevos)} icon={UserPlus} loading={collection.loading} />
      <StatCard label="Ciudad principal" value={topCiudad?.label ?? "—"} icon={MapPin} hint={topCiudad ? `${topCiudad.value} clientes` : ""} loading={collection.loading} />
    </>
  );

  return <ResourcePage collection={collection} config={config} kpis={kpis} />;
}
