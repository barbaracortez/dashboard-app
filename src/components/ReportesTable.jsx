import { useEffect, useState } from "react";

function ReportesTable() {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/reportes")
      .then((res) => res.json())
      .then((data) => setReportes(data))
      .catch((err) => console.error("Error al obtener reportes:", err));
  }, []);

  return (
    <div className="orders-table">
      <h3>Listado de Reportes</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r) => (
            <tr key={r.id}>
              <td>{r.tipo}</td>
              <td>{r.fecha}</td>
              <td>{r.responsable}</td>
              <td>
                <span className={`estado ${r.estado}`}>{r.estado}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportesTable;
