import OportunidadesTable from "./OportunidadesTable";
import NuevaOportunidadForm from "./NuevaOportunidadForm";
import { useState, useEffect } from "react";

function Oportunidades() {
  const [oportunidades, setOportunidades] = useState([]);
  const [oportunidadEditando, setOportunidadEditando] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/oportunidades")
      .then((res) => res.json())
      .then((data) => setOportunidades(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleNueva = (nueva) => {
    setOportunidades([...oportunidades, nueva]);
  };

  const handleEliminar = (id) => {
    fetch(`http://localhost:3000/oportunidades/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setOportunidades((prev) => prev.filter((op) => op.id !== id));
      })
      .catch((err) => console.error("Error al eliminar oportunidad:", err));
  };
  const handleEditar = (oportunidad) => {
    setOportunidadEditando(oportunidad);
  };

  // Contadores
  const total = oportunidades.length;
  const ganadas = oportunidades.filter(
    (o) => o.estado.toLowerCase() === "ganada"
  );
  const perdidas = oportunidades.filter(
    (o) => o.estado.toLowerCase() === "perdida"
  );
  const negociacion = oportunidades.filter(
    (o) => o.estado.toLowerCase() === "en negociación"
  );

  // Montos
  const montoTotal = oportunidades.reduce(
    (acc, op) => acc + Number(op.monto || 0),
    0
  );
  const montoGanado = ganadas.reduce(
    (acc, op) => acc + Number(op.monto || 0),
    0
  );
  const montoPerdido = perdidas.reduce(
    (acc, op) => acc + Number(op.monto || 0),
    0
  );

  // Porcentajes
  const porcentajeGanadas = total
    ? Math.round((ganadas.length / total) * 100)
    : 0;
  const porcentajePerdidas = total
    ? Math.round((perdidas.length / total) * 100)
    : 0;
  const porcentajeNegociacion = total
    ? 100 - porcentajeGanadas - porcentajePerdidas
    : 0;

  return (
    <div className="dashboard">
      <h1>Gestión de oportunidades</h1>
      <div className="cards">
        <div className="card">
          <h3>Total Oportunidades</h3>
          <p>{total}</p>
        </div>
        <div className="card">
          <h3>Monto Total</h3>
          <p>${montoTotal}</p>
        </div>
        <div className="card">
          <h3>Ganadas</h3>
          <p>
            {ganadas.length} | ${montoGanado} | {porcentajeGanadas}%
          </p>
        </div>
        <div className="card">
          <h3>Perdidas</h3>
          <p>
            {perdidas.length} | ${montoPerdido} | {porcentajePerdidas}%
          </p>
        </div>
        <div className="card">
          <h3>En Negociación</h3>
          <p>
            {negociacion.length} | {porcentajeNegociacion}%
          </p>
        </div>
      </div>

      <NuevaOportunidadForm
        onAgregar={handleNueva}
        oportunidadEditando={oportunidadEditando}
        setOportunidadEditando={setOportunidadEditando}
      />

      {oportunidadEditando && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetch(
              `http://localhost:3000/oportunidades/${oportunidadEditando.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(oportunidadEditando),
              }
            )
              .then((res) => res.json())
              .then((dataActualizada) => {
                setOportunidades((prev) =>
                  prev.map((op) =>
                    op.id === dataActualizada.id ? dataActualizada : op
                  )
                );
                setOportunidadEditando(null);
              })
              .catch((err) => console.error("Error al actualizar:", err));
          }}
          className="formulario"
        >
          <h3>Editar Oportunidad</h3>
          <input
            type="text"
            name="cliente"
            placeholder="Cliente"
            value={oportunidadEditando.cliente}
            onChange={(e) =>
              setOportunidadEditando({
                ...oportunidadEditando,
                cliente: e.target.value,
              })
            }
            required
          />
          <input
            type="text"
            name="producto"
            placeholder="Producto"
            value={oportunidadEditando.producto}
            onChange={(e) =>
              setOportunidadEditando({
                ...oportunidadEditando,
                producto: e.target.value,
              })
            }
            required
          />
          <input
            type="number"
            name="monto"
            placeholder="Monto"
            value={oportunidadEditando.monto}
            onChange={(e) =>
              setOportunidadEditando({
                ...oportunidadEditando,
                monto: e.target.value,
              })
            }
            required
          />
          <select
            name="estado"
            value={oportunidadEditando.estado}
            onChange={(e) =>
              setOportunidadEditando({
                ...oportunidadEditando,
                estado: e.target.value,
              })
            }
          >
            <option value="En negociación">En negociación</option>
            <option value="Ganada">Ganada</option>
            <option value="Perdida">Perdida</option>
          </select>
          <button type="submit">Actualizar</button>
        </form>
      )}

      <OportunidadesTable
        oportunidades={oportunidades}
        onEliminar={handleEliminar}
        onEditar={handleEditar}
      />
    </div>
  );
}

export default Oportunidades;
