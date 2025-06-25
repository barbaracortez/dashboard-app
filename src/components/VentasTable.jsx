function VentasTable() {
  const ventas = [
    {
      id: 1,
      producto: "Laptop HP",
      cantidad: 2,
      total: "$2400",
      estado: "Completado",
    },
    {
      id: 2,
      producto: "Mouse Logitech",
      cantidad: 5,
      total: "$150",
      estado: "Pendiente",
    },
    {
      id: 3,
      producto: "Teclado Redragon",
      cantidad: 3,
      total: "$210",
      estado: "Cancelado",
    },
    {
      id: 4,
      producto: "Monitor Samsung",
      cantidad: 1,
      total: "$300",
      estado: "Completado",
    },
  ];

  const verVenta = (id) => {
    alert(`Detalles de la venta #${id}`);
  };

  const editarVenta = (id) => {
    alert(`Editar venta #${id}`);
  };

  const eliminarVenta = (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de eliminar esta venta?"
    );
    if (confirmacion) {
      alert(`Venta #${id} eliminada`);
    }
  };

  return (
    <div className="orders-table">
      <h3>Ventas Realizadas</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.producto}</td>
              <td>{venta.cantidad}</td>
              <td>{venta.total}</td>
              <td>
                <span className={`estado ${venta.estado.toLowerCase()}`}>
                  {venta.estado}
                </span>
              </td>
              <td>
                <button onClick={() => verVenta(venta.id)}>Ver</button>
                <button onClick={() => editarVenta(venta.id)}>Editar</button>
                <button onClick={() => eliminarVenta(venta.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VentasTable;
