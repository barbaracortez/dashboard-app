import {  Link, NavLink } from "react-router-dom";
import "../styles/App.css"; 

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Mi Panel</h2>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/ventas"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Ventas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/clientes"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Clientes
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/reportes"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Reportes
          </NavLink>
        </li>
        <li>
          <Link to="/leads">Leads</Link>
        </li>
        <li>
          <Link to="/oportunidades">Oportunidades</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
