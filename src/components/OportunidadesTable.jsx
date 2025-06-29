
function OportunidadesTable ({ oportunidades}) {
    return (
      <div className="orders-table">
        <h3>Oportunidades Actuales</h3>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {oportunidades.map((op) => (
              <tr key={op.id}>
                <td>{op.cliente}</td>
                <td>{op.producto}</td>
                <td>${op.monto}</td>
                <td>{op.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default OportunidadesTable;