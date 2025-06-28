import { useState } from "react";

function NuevoLeadForm({onAgregar}) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    fuente: "",
    estado: "nuevo",
    fecha: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Lead agregado con éxito");
        onAgregar(data);
        setForm({
          nombre: "",
          email: "",
          fuente: "",
          estado: "nuevo",
          fecha: new Date().toISOString().slice(0, 10),
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <input
        type="text"
        name="nombre"
        placeholder="Empresa"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contacto"
        placeholder="Contacto"
        value={form.contacto}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="fuente"
        placeholder="Fuente (LinkedIn, Web, etc.)"
        value={form.fuente}
        onChange={handleChange}
      />
      <select name="estado" value={form.estado} onChange={handleChange}>
        <option value="Nuevo">Nuevo</option>
        <option value="Contactado">Contactado</option>
        <option value="Calificado">Calificado</option>
      </select>
      <button type="submit">Agregar Lead</button>
    </form>
  );
}

export default NuevoLeadForm;
