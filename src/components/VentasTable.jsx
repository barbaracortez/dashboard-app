

function VentasTable({ventas}) {
    return (
    <div className="orders-table">
      <h3>Listado de Ventas</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.producto}</td>
              <td>{venta.cantidad}</td>
              <td>${venta.total}</td>
              <td>
                <span className={`estado ${venta.estado}`}>{venta.estado}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VentasTable;
