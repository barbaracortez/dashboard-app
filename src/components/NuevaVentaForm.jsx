import { useState } from "react";

function NuevaVentaForm({ onVentaAgregada }) {
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [monto, setMonto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto || !cantidad || !monto) {
      alert("Por favor completá todos los campos.");
      return;
    }

    const nuevaVenta = {
      producto,
      cantidad: parseInt(cantidad),
      monto: parseFloat(monto),
      fecha: new Date().toISOString().split("T")[0],
      estado: "pendiente",
    };

    try {
      const res = await fetch("http://localhost:3000/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaVenta),
      });

      if (res.ok) {
        const data = await res.json();
        onVentaAgregada(data); 
        setProducto("");
        setCantidad("");
        setMonto("");
      } else {
        alert("Error al agregar la venta.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-venta">
      <h3>Agregar Nueva Venta</h3>
      <input
        type="text"
        placeholder="Producto"
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />
      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <button type="submit">Agregar Venta</button>
    </form>
  );
}

export default NuevaVentaForm;
