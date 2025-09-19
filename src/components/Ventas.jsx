import VentasTable from "./VentasTable";
import NuevaVentaForm from "./NuevaVentaForm";
import { useState, useEffect } from "react";


function Ventas () {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
      fetch("http://localhost:5000/ventas")
        .then((res) => res.json())
        .then((data) => setVentas(data))
        .catch((err) => console.error("Error al obtener ventas:", err));
    }, []);

    const handleVentaAgregada = (nuevaVenta) => {
      setVentas((prev) => [...prev, nuevaVenta]);
    };

    const totalGeneral = ventas.reduce((acumulador, venta)=>{
        return acumulador + (venta.total || 0);
    }, 0);

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    const ventasDelMes = ventas.filter((venta) => {
      if (!venta.fecha) return false;
      const fechaVenta = new Date(venta.fecha);
      return (
        fechaVenta.getMonth() === mesActual &&
        fechaVenta.getFullYear() === añoActual
      );
    });

    const totalVentasMes = ventasDelMes.reduce(
      (acc, venta) => acc + (venta.total || 0),
      0
    );

    const pedidosPendientes = ventas.filter(
        (venta) => venta.estado === "pendiente"
    ).length;
    

    return (
      <div className="dashboard">
        <h1>Panel de Ventas</h1>
        <div className="cards">
          <div className="card">
            <h3>Total de Ventas</h3>
            <p>${totalGeneral}</p>
          </div>
          <div className="card">
            <h3>Ventas del mes</h3>
            <p>${totalVentasMes}</p>
          </div>
          <div className="card">
            <h3>Pedidos Pendientes</h3>
            <p>{pedidosPendientes}</p>
          </div>
        </div>
        <NuevaVentaForm onVentaAgregada={handleVentaAgregada} />
        <VentasTable ventas={ventas} />
      </div>
    );
}

export default Ventas;
