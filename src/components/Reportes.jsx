import ReportesTable from "./ReportesTable";

function Reportes () {
    return (
      <div className="dashboard">
        <h1>Panel de Reportes</h1>
        <div className="cards">
          <div className="card">
            <h3>Reporte Semanal</h3>
            <p>✔️ Entregado</p>
          </div>
          <div className="card">
            <h3>Reporte Mensual</h3>
            <p>🕒 En progreso</p>
          </div>
          <div className="card">
            <h3>Errores Detectados</h3>
            <p>3</p>
          </div>
        </div>
        <ReportesTable/>
      </div>
    );
}

export default Reportes;
