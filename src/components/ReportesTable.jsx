function ReportesTable() {
  const reportes = [
    {
      id: 1,
      tipo: "Ventas Mensuales",
      fecha: "2025-06-10",
      responsable: "Juan Pérez",
      estado: "Generado",
    },
    {
      id: 2,
      tipo: "Clientes Nuevos",
      fecha: "2025-06-15",
      responsable: "Lucía Gómez",
      estado: "Pendiente",
    },
    {
      id: 3,
      tipo: "Errores del Sistema",
      fecha: "2025-06-18",
      responsable: "Carlos Méndez",
      estado: "Revisado",
    },
    {
      id: 4,
      tipo: "Ingresos Totales",
      fecha: "2025-06-20",
      responsable: "Ana Torres",
      estado: "Generado",
    },
  ];

  const verReporte = (id) => {
    alert(`Ver reporte #${id}`);
  };

  const editarReporte = (id) => {
    alert(`Editar reporte #${id}`);
  };

  const eliminarReporte = (id) => {
    const confirmacion = window.confirm("¿Eliminar reporte?");
    if (confirmacion) {
      alert(`Reporte #${id} eliminado`);
    }
  };

  return (
    <div className="orders-table">
      <h3>Historial de Reportes</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r) => (
            <tr key={r.id}>
              <td>{r.tipo}</td>
              <td>{r.fecha}</td>
              <td>{r.responsable}</td>
              <td>
                <span className={`estado ${r.estado.toLowerCase()}`}>
                  {r.estado}
                </span>
              </td>
              <td>
                <button onClick={() => verReporte(r.id)}>Ver</button>
                <button onClick={() => editarReporte(r.id)}>Editar</button>
                <button onClick={() => eliminarReporte(r.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportesTable;
