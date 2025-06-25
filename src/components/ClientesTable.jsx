function ClientesTable() {
  const clientes = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@example.com",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Lucía Gómez",
      email: "lucia@example.com",
      estado: "Inactivo",
    },
    {
      id: 3,
      nombre: "Carlos Méndez",
      email: "carlos@example.com",
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Ana Torres",
      email: "ana@example.com",
      estado: "Pendiente",
    },
  ];

  return (
    <div className="orders-table">
      <h3>Lista de Clientes</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.email}</td>
              <td>
                <span className={`estado ${cliente.estado.toLowerCase()}`}>
                  {cliente.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientesTable;
