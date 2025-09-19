import { useState } from "react";

function NuevoClienteForm({ onClienteAgregado }) {
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    email: "",
    estado: "Activo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCliente),
    })
      .then((res) => res.json())
      .then((data) => {
        onClienteAgregado(data);
        setNuevoCliente({ nombre: "", email: "", estado: "Activo" });
      })
      .catch((err) => console.error("Error al agregar cliente:", err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h3>Agregar Cliente</h3>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={nuevoCliente.nombre}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={nuevoCliente.email}
        onChange={handleChange}
        required
      />
      <select name="estado" value={nuevoCliente.estado} onChange={handleChange}>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
        <option value="Pendiente">Pendiente</option>
      </select>
      <button type="submit">Agregar</button>
    </form>
  );
}

export default NuevoClienteForm;
