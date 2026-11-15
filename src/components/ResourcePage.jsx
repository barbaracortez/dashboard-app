import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Plus, Search, RefreshCw } from "lucide-react";
import PageHeader from "./ui/PageHeader";
import DataTable from "./ui/DataTable";
import Modal from "./ui/Modal";
import ResourceForm from "./ResourceForm";

const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function exportCsv(filename, columns, rows) {
  const cols = columns.filter((c) => c.csv !== false);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    cols.map((c) => escape(c.label)).join(";"),
    ...rows.map((r) => cols.map((c) => escape(c.csvValue ? c.csvValue(r) : r[c.key])).join(";")),
  ];
  // BOM para que Excel respete los acentos
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Página CRUD genérica.
 * collection: resultado de useCollection
 * config: { title, subtitle, singular, columns, fields, statusField, statusOptions,
 *           searchKeys, empty(), toRecord(form), kpis: ReactNode, defaultSort }
 */
export default function ResourcePage({ collection, config, kpis, children }) {
  const { items, loading, error, reload, create, update, remove } = collection;
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  // Si la búsqueda global cambia el parámetro ?q= estando en esta página
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);
  const [status, setStatus] = useState("Todos");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return items.filter((item) => {
      if (status !== "Todos" && item[config.statusField] !== status) return false;
      if (!q) return true;
      return config.searchKeys.some((k) => normalize(item[k]).includes(q));
    });
  }, [items, query, status, config.statusField, config.searchKeys]);

  const counts = useMemo(() => {
    const c = { Todos: items.length };
    for (const s of config.statusOptions) c[s] = items.filter((i) => i[config.statusField] === s).length;
    return c;
  }, [items, config.statusOptions, config.statusField]);

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      const record = config.toRecord ? config.toRecord(form) : form;
      if (editing === "new") await create(record);
      else await update(editing.id, { ...editing, ...record });
      setEditing(null);
    } catch {
      // el toast ya informó el error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deleting.id);
    } finally {
      setDeleting(null);
    }
  };

  const formId = `form-${config.singular}`;
  const nuevo = `${config.feminine ? "Nueva" : "Nuevo"} ${config.singular}`;

  return (
    <div className="page">
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => exportCsv(config.title.toLowerCase(), config.columns, filtered)} disabled={loading || filtered.length === 0}>
              <Download size={16} /> Exportar
            </button>
            <button className="btn btn-primary" onClick={() => setEditing("new")}>
              <Plus size={16} /> {nuevo}
            </button>
          </>
        }
      />

      {kpis && <div className="kpi-grid">{kpis}</div>}

      {children}

      <section className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} aria-hidden="true" />
            <input
              className="input"
              type="search"
              placeholder={`Buscar ${config.title.toLowerCase()}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={`Buscar ${config.title.toLowerCase()}`}
            />
          </div>
          <div className="segmented" role="tablist" aria-label="Filtrar por estado">
            {["Todos", ...config.statusOptions].map((s) => (
              <button key={s} role="tab" aria-selected={status === s} className={status === s ? "active" : ""} onClick={() => setStatus(s)}>
                {s}
                <span className="count">{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={reload}>
              <RefreshCw size={16} /> Reintentar
            </button>
          </div>
        ) : (
          <DataTable
            columns={config.columns}
            rows={filtered}
            loading={loading}
            defaultSort={config.defaultSort}
            onEdit={(row) => setEditing(row)}
            onDelete={(row) => setDeleting(row)}
            emptyText={query || status !== "Todos" ? "No hay resultados para ese filtro" : `Todavía no hay ${config.title.toLowerCase()}`}
          />
        )}
      </section>

      <Modal
        open={editing !== null}
        title={editing === "new" ? nuevo : `Editar ${config.singular}`}
        onClose={() => !saving && setEditing(null)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" form={formId} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </>
        }
      >
        {editing !== null && (
          <ResourceForm
            key={editing === "new" ? "new" : editing.id}
            id={formId}
            fields={config.fields}
            initial={editing === "new" ? config.empty() : editing}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>

      <Modal
        open={deleting !== null}
        title={`Eliminar ${config.singular}`}
        size="sm"
        onClose={() => setDeleting(null)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleting(null)}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          </>
        }
      >
        <p>
          ¿Seguro que querés eliminar <strong>{deleting && config.describe(deleting)}</strong>? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
