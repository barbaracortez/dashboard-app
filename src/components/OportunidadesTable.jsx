
function OportunidadesTable ({ oportunidades, onEliminar, onEditar}) {
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
            {oportunidades.length === 0 ? (
              <tr>
                <td colSpan="4">No hay oportunidades registradas.</td>
              </tr>
            ) : (
              oportunidades.map((op) => (
                <tr key={op.id}>
                  <td>{op.cliente}</td>
                  <td>{op.producto}</td>
                  <td>${parseFloat(op.monto).toLocaleString("es-AR")}</td>
                  <td>
                    <span
                      className={`estado ${op.estado
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {op.estado}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => onEliminar(op.id)}>Eliminar</button>
                  </td>
                  <td>
                    <button onClick={() => onEditar(op)}>Editar</button>
            
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
}

export default OportunidadesTable;