import '../styles/App.css'

const order = [
  {
    id: 1,
    cliente: "María García",
    estado: "Pendiente",
    total: "$1200",
    fecha: "2025-06-20",
  },
  {
    id: 2,
    cliente: "Juan Pérez",
    estado: "completado",
    total: "$850",
    fecha: "2025-06-19",
  },
  {
    id: 3,
    cliente: "Laura Torres",
    estado: "Cancelado",
    total: "$300",
    fecha: "2025-06-18",
  },
  {
    id: 4,
    cliente: "Carlos Ruiz",
    estado: "Pendiente",
    total: "$980",
    fecha: "2025-06-17",
  },
];

function OrdersTable() {
    return (
      <div className="orders-table">
        <h3>Últimas Órdenes</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Clientes</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {order.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.cliente}</td>
                <td className={`estado ${order.estado.toLocaleLowerCase()}`}>
                  {order.estado}
                </td>
                <td>{order.total}</td>
                <td>{order.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default OrdersTable