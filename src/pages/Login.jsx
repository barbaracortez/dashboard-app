import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Hexagon, Eye, EyeOff, Info, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { DEMO_USER, useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from ?? "/";
  if (user) return <Navigate to={from} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completá email y contraseña.");
      return;
    }
    if (login(email, password)) navigate(from, { replace: true });
    else setError("Email o contraseña incorrectos.");
  };

  const fillDemo = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setError("");
  };

  return (
    <div className="login">
      <section className="login-hero" aria-hidden="true">
        <div className="brand brand-lg">
          <Hexagon size={28} className="brand-mark" />
          <span>Nexo CRM</span>
        </div>
        <div>
          <h2>Todo tu proceso comercial, en un solo lugar.</h2>
          <ul className="login-features">
            <li><BarChart3 size={18} /> Métricas de ventas en tiempo real</li>
            <li><Zap size={18} /> Pipeline de oportunidades y leads</li>
            <li><ShieldCheck size={18} /> Gestión centralizada de clientes</li>
          </ul>
        </div>
        <p className="login-hero-foot">Proyecto demo · React + Vite</p>
      </section>

      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="brand brand-mobile">
            <Hexagon size={24} className="brand-mark" aria-hidden="true" />
            <span>Nexo CRM</span>
          </div>
          <h1>Iniciar sesión</h1>
          <p className="muted">Ingresá a tu panel comercial.</p>

          <div className="demo-hint">
            <Info size={18} aria-hidden="true" />
            <div>
              <strong>Cuenta de demostración</strong>
              <span>{DEMO_USER.email} · {DEMO_USER.password}</span>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={fillDemo}>
              Usar
            </button>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-btn">
              <input id="password" className="input" type={showPass ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              <button type="button" className="icon-btn" onClick={() => setShowPass((s) => !s)} aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn btn-primary btn-block" type="submit">
            Ingresar
          </button>
        </form>
      </section>
    </div>
  );
}
