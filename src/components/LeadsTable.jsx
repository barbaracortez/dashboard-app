function LeadsTable({ leads }) {
  return (
    <div className="orders-table">
      <h3>Leads Registrados</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fuente</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.nombre}</td>
              <td>{lead.email}</td>
              <td>{lead.fuente}</td>
              <td>{lead.fecha}</td>
              <td>
                <td>
                  <span className={`estado ${lead.estado}`}>{lead.estado}</span>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsTable;
