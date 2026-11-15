import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Pencil, Trash2, Inbox } from "lucide-react";

const PAGE_SIZE = 10;

function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), "es", { numeric: true });
}

export default function DataTable({ columns, rows, loading, onEdit, onDelete, emptyText = "No hay registros", defaultSort }) {
  const [sort, setSort] = useState(defaultSort ?? null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.sortValue ?? ((r) => r[sort.key]);
    return [...rows].sort((a, b) => compare(get(a), get(b)) * (sort.dir === "asc" ? 1 : -1));
  }, [rows, sort, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = sorted.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const hasActions = onEdit || onDelete;

  const toggleSort = (key) => {
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  return (
    <div className="table-wrap">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.align === "right" ? "num" : ""} aria-sort={sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}>
                  {c.sortable === false ? (
                    c.label
                  ) : (
                    <button className="th-sort" onClick={() => toggleSort(c.key)}>
                      {c.label}
                      {sort?.key === c.key ? (
                        sort.dir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      ) : (
                        <ChevronsUpDown size={14} className="sort-idle" />
                      )}
                    </button>
                  )}
                </th>
              ))}
              {hasActions && <th className="actions-col"><span className="sr-only">Acciones</span></th>}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      <div className="skeleton skeleton-text" />
                    </td>
                  ))}
                  {hasActions && <td />}
                </tr>
              ))}

            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)}>
                  <div className="empty-state">
                    <Inbox size={28} />
                    <p>{emptyText}</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              visible.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.align === "right" ? "num" : ""}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="actions-col">
                      <div className="row-actions">
                        {onEdit && (
                          <button className="icon-btn" onClick={() => onEdit(row)} aria-label="Editar" title="Editar">
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button className="icon-btn danger" onClick={() => onDelete(row)} aria-label="Eliminar" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && sorted.length > PAGE_SIZE && (
        <div className="pagination">
          <span>
            {current * PAGE_SIZE + 1}–{Math.min((current + 1) * PAGE_SIZE, sorted.length)} de {sorted.length}
          </span>
          <div className="pagination-btns">
            <button className="btn btn-ghost btn-sm" disabled={current === 0} onClick={() => setPage(current - 1)}>
              Anterior
            </button>
            <button className="btn btn-ghost btn-sm" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
