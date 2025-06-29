import { useState, useEffect } from "react";

function NuevaOportunidadForm({
  onAgregar,
  oportunidadEditando,
  setOportunidadEditando,
}) {
  const [form, setForm] = useState({
    cliente: "",
    producto: "",
    monto: "",
    estado: "En negociación",
  });

  const [clientes, setClientes] = useState([]); // 🔹 Estado nuevo para clientes

  // 🔹 Traer clientes
  useEffect(() => {
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error al cargar clientes:", err));
  }, []);

  // 🔹 Si se edita, llenar el form
  useEffect(() => {
    if (oportunidadEditando) {
      setForm(oportunidadEditando);
    }
  }, [oportunidadEditando]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = oportunidadEditando
      ? `http://localhost:3000/oportunidades/${oportunidadEditando.id}`
      : "http://localhost:3000/oportunidades";

    const method = oportunidadEditando ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (oportunidadEditando) {
          setOportunidadEditando(null); // reset edición
        } else {
          onAgregar(data); // nuevo
        }
        setForm({
          cliente: "",
          producto: "",
          monto: "",
          estado: "En negociación",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <select
        name="cliente"
        value={form.cliente}
        onChange={handleChange}
        required
      >
        <option value="">Seleccionar cliente</option>
        {clientes.map((cli) => (
          <option key={cli.id} value={cli.nombre}>
            {cli.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="producto"
        placeholder="Producto"
        value={form.producto}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="monto"
        placeholder="Monto"
        value={form.monto}
        onChange={handleChange}
        required
      />
      <select name="estado" value={form.estado} onChange={handleChange}>
        <option value="En negociación">En negociación</option>
        <option value="Ganada">Ganada</option>
        <option value="Perdida">Perdida</option>
      </select>
      <button type="submit">
        {oportunidadEditando ? "Guardar Cambios" : "Agregar Oportunidad"}
      </button>
    </form>
  );
}

export default NuevaOportunidadForm;
