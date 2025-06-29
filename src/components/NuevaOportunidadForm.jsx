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

  useEffect(() => {
    if (oportunidadEditando) {
      setForm(oportunidadEditando);
    } else {
      // Reset cuando no se edita nada
      setForm({
        cliente: "",
        producto: "",
        monto: "",
        estado: "En negociación",
      });
    }
  }, [oportunidadEditando]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (oportunidadEditando) {
      // Modo edición
      fetch(`http://localhost:3000/oportunidades/${oportunidadEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Oportunidad actualizada");
          setOportunidadEditando(null);
        });
    } else {
      // Modo creación
      fetch("http://localhost:3000/oportunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((nueva) => {
          onAgregar(nueva);
          alert("Oportunidad agregada");
        });
    }

    // Reset
    setForm({
      cliente: "",
      producto: "",
      monto: "",
      estado: "En negociación",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h3>{oportunidadEditando ? "Editar" : "Nueva"} Oportunidad</h3>

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

      <button type="submit">
        {oportunidadEditando ? "Guardar Cambios" : "Agregar Oportunidad"}
      </button>

      {oportunidadEditando && (
        <button
          type="button"
          onClick={() => {
            setOportunidadEditando(null);
          }}
        >
          Cancelar edición
        </button>
      )}
    </form>
  );
}

export default NuevaOportunidadForm;
