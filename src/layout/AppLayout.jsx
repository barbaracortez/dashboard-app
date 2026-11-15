import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Users, UserPlus, Target, FileBarChart, Settings,
  Menu, Moon, Sun, LogOut, Search, ChevronDown, Hexagon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { isDemoMode } from "../services/api";
import { initials } from "../utils/format";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/leads", label: "Leads", icon: UserPlus },
  { to: "/oportunidades", label: "Oportunidades", icon: Target },
  { to: "/reportes", label: "Reportes", icon: FileBarChart },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Navegación principal">
        <div className="brand">
          <Hexagon size={22} className="brand-mark" aria-hidden="true" />
          <span>Nexo CRM</span>
        </div>
        <nav className="nav">
          <span className="nav-section">General</span>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="nav-link" onClick={onClose}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="nav nav-bottom">
          <NavLink to="/configuracion" className="nav-link" onClick={onClose}>
            <Settings size={18} aria-hidden="true" />
            Configuración
          </NavLink>
          {isDemoMode && (
            <div className="demo-note">
              <strong>Modo demo</strong>
              Los datos se guardan en tu navegador.
            </div>
          )}
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        <span className="avatar" aria-hidden="true">{initials(user?.nombre)}</span>
        <span className="user-info">
          <span className="user-name">{user?.nombre}</span>
          <span className="user-role">{user?.rol}</span>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="dropdown" role="menu">
          <div className="dropdown-header">
            <strong>{user?.nombre}</strong>
            <span>{user?.email}</span>
          </div>
          <button role="menuitem" onClick={() => { setOpen(false); navigate("/configuracion"); }}>
            <Settings size={16} /> Configuración
          </button>
          <button role="menuitem" onClick={handleLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function Topbar({ onMenu }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/clientes?q=${encodeURIComponent(q.trim())}`);
    setQ("");
  };

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Abrir menú">
        <Menu size={20} />
      </button>
      <form className="search topbar-search" onSubmit={onSearch} role="search">
        <Search size={16} aria-hidden="true" />
        <input className="input" type="search" placeholder="Buscar clientes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar clientes" />
      </form>
      <div className="topbar-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"} title="Cambiar tema">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <UserMenu />
      </div>
    </header>
  );
}

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">© {new Date().getFullYear()} Nexo CRM · Proyecto demo desarrollado con React + Vite</footer>
      </div>
    </div>
  );
}
