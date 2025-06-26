import VentasTable from "./VentasTable";
import NuevaVentaForm from "./NuevaVentaForm";
import { useState, useEffect } from "react";

function Ventas () {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
      fetch("http://localhost:3000/ventas")
        .then((res) => res.json())
        .then((data) => setVentas(data))
        .catch((err) => console.error("Error al obtener ventas:", err));
    }, []);

    const handleVentaAgregada = (nuevaVenta) => {
      setVentas((prev) => [...prev, nuevaVenta]);
    };
    return (
      <div className="dashboard">
        <h1>Panel de Ventas</h1>
        <div className="cards">
          <div className="card">
            <h3>Total de Ventas</h3>
            <p>$12.400</p>
          </div>
          <div className="card">
            <h3>Ventas del mes</h3>
            <p>$2.500</p>
          </div>
          <div className="card">
            <h3>Pedidos Pendientes</h3>
            <p>8</p>
          </div>
        </div>
        <NuevaVentaForm onVentaAgregada={handleVentaAgregada} />
        <VentasTable ventas={ventas} />
      </div>
    );
}

export default Ventas;
