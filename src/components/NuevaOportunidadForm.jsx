import { useState } from "react";

function NuevaOportunidadForm({ onAgregar }) {
  const [form, setForm] = useState({
    cliente: "",
    producto: "",
    monto: "",
    estado: "En negociación",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/oportunidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((nuevaOportunidad) => {
        onAgregar(nuevaOportunidad);
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
      <input
        type="text"
        name="cliente"
        placeholder="Cliente"
        value={form.cliente}
        onChange={handleChange}
        required
      />
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
      <button type="submit">Agregar Oportunidad</button>
    </form>
  );
}

export default NuevaOportunidadForm;
