import { Link } from "react-router-dom";
import "../styles/App.css"; 

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Mi Panel</h2>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/ventas">Ventas</Link>
        </li>
        <li>
          <Link to="/clientes">Clientes</Link>
        </li>
        <li>
          <Link to="/reportes">Reportes</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
