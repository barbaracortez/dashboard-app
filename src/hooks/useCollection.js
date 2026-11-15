import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";

// Carga una colección y expone operaciones CRUD con notificaciones.
export function useCollection(name) {
  const notify = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.list(name));
    } catch (e) {
      setError(e.message || "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn, successMsg) => {
    try {
      const result = await fn();
      notify(successMsg);
      return result;
    } catch (e) {
      notify(e.message || "Ocurrió un error", "error");
      throw e;
    }
  };

  const create = (data) =>
    run(async () => {
      const item = await api.create(name, data);
      setItems((prev) => [item, ...prev]);
      return item;
    }, "Registro creado");

  const update = (id, data) =>
    run(async () => {
      const item = await api.update(name, id, data);
      setItems((prev) => prev.map((x) => (x.id === id ? item : x)));
      return item;
    }, "Cambios guardados");

  const remove = (id) =>
    run(async () => {
      await api.remove(name, id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, "Registro eliminado");

  return { items, loading, error, reload: load, create, update, remove };
}
