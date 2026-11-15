import { useMemo } from "react";
import { DollarSign, Receipt, Clock, TrendingUp } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import ResourcePage from "../components/ResourcePage";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import { ESTADOS, PRODUCTOS } from "../data/seed";
import { completadas, ingresos, ventasDelMes } from "../utils/analytics";
import { delta, formatDate, formatMoney, formatNumber, todayIso } from "../utils/format";

export default function Ventas() {
  const collection = useCollection("ventas");
  const clientes = useCollection("clientes");
  const items = collection.items;

  const config = useMemo(
    () => ({
      title: "Ventas",
      singular: "venta",
      feminine: true,
      subtitle: "Registro de operaciones y facturación.",
      statusField: "estado",
      statusOptions: ESTADOS.ventas,
      searchKeys: ["cliente", "producto"],
      defaultSort: { key: "fecha", dir: "desc" },
      describe: (v) => `la venta de ${v.producto} a ${v.cliente}`,
      columns: [
        { key: "fecha", label: "Fecha", render: (v) => <span className="muted">{formatDate(v.fecha)}</span> },
        { key: "cliente", label: "Cliente", render: (v) => <span className="strong">{v.cliente}</span> },
        { key: "producto", label: "Producto" },
        { key: "cantidad", label: "Cant.", align: "right" },
        { key: "total", label: "Total", align: "right", render: (v) => formatMoney(v.total) },
        { key: "estado", label: "Estado", render: (v) => <Badge>{v.estado}</Badge> },
      ],
      fields: [
        {
          name: "cliente", label: "Cliente", type: "select", required: true, full: true,
          options: clientes.items.map((c) => c.empresa).sort((a, b) => a.localeCompare(b, "es")),
        },
        {
          name: "producto", label: "Producto", type: "select", required: true, full: true,
          options: PRODUCTOS.map((p) => ({ value: p.nombre, label: `${p.nombre} — ${formatMoney(p.precio)}` })),
          onChange: (_form, value) => {
            const p = PRODUCTOS.find((x) => x.nombre === value);
            return p ? { precioUnitario: p.precio } : {};
          },
        },
        { name: "cantidad", label: "Cantidad", type: "number", required: true, min: 1 },
        { name: "precioUnitario", label: "Precio unitario (US$)", type: "number", required: true, min: 0 },
        { name: "fecha", label: "Fecha", type: "date", required: true },
        { name: "estado", label: "Estado", type: "select", required: true, options: ESTADOS.ventas },
      ],
      empty: () => ({ cliente: "", producto: "", cantidad: 1, precioUnitario: "", fecha: todayIso(), estado: "Pendiente" }),
      toRecord: (f) => ({ ...f, cantidad: Number(f.cantidad), precioUnitario: Number(f.precioUnitario), total: Number(f.cantidad) * Number(f.precioUnitario) }),
    }),
    [clientes.items]
  );

  const mes = ventasDelMes(items, 0);
  const prev = ventasDelMes(items, 1);
  const comp = completadas(items);
  const ticket = comp.length ? ingresos(items) / comp.length : 0;
  const pendientes = items.filter((v) => v.estado === "Pendiente");

  const kpis = (
    <>
      <StatCard label="Facturación total" value={formatMoney(ingresos(items))} icon={DollarSign} hint={`${comp.length} ventas completadas`} loading={collection.loading} />
      <StatCard label="Facturación del mes" value={formatMoney(ingresos(mes))} icon={TrendingUp} change={delta(ingresos(mes), ingresos(prev))} hint="vs. mes anterior" loading={collection.loading} />
      <StatCard label="Ticket promedio" value={formatMoney(ticket)} icon={Receipt} loading={collection.loading} />
      <StatCard label="Pendientes de cobro" value={formatNumber(pendientes.length)} icon={Clock} hint={formatMoney(pendientes.reduce((a, v) => a + v.total, 0))} loading={collection.loading} />
    </>
  );

  return <ResourcePage collection={collection} config={config} kpis={kpis} />;
}
