import { useState } from "react";
import { Moon, Sun, RotateCcw, Database, Server } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { isDemoMode, resetDemoData } from "../services/api";
import { initials } from "../utils/format";

export default function Configuracion() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const notify = useToast();
  const [confirm, setConfirm] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setConfirm(false);
    notify("Datos de demostración restablecidos");
  };

  return (
    <div className="page">
      <PageHeader title="Configuración" subtitle="Preferencias de tu cuenta y de la aplicación." />

      <div className="settings">
        <section className="card">
          <div className="card-header"><h3>Perfil</h3></div>
          <div className="profile">
            <span className="avatar avatar-lg" aria-hidden="true">{initials(user?.nombre)}</span>
            <div>
              <div className="strong">{user?.nombre}</div>
              <div className="muted">{user?.rol}</div>
              <div className="muted small">{user?.email}</div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h3>Apariencia</h3>
              <p className="card-subtitle">Elegí el tema de la interfaz.</p>
            </div>
          </div>
          <div className="theme-options" role="radiogroup" aria-label="Tema">
            {[
              { value: "light", label: "Claro", icon: Sun },
              { value: "dark", label: "Oscuro", icon: Moon },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} role="radio" aria-checked={theme === value} className={`theme-option ${theme === value ? "active" : ""}`} onClick={() => setTheme(value)}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h3>Datos</h3>
              <p className="card-subtitle">Origen de la información que muestra el panel.</p>
            </div>
          </div>
          <div className="setting-row">
            {isDemoMode ? <Database size={20} /> : <Server size={20} />}
            <div className="grow">
              <div className="strong">{isDemoMode ? "Modo demo (almacenamiento local)" : "API REST conectada"}</div>
              <div className="muted small">
                {isDemoMode
                  ? "Los cambios se guardan en este navegador. Podés volver a los datos originales cuando quieras."
                  : `Conectado a ${import.meta.env.VITE_API_URL}`}
              </div>
            </div>
            {isDemoMode && (
              <button className="btn btn-secondary" onClick={() => setConfirm(true)}>
                <RotateCcw size={16} /> Restablecer datos
              </button>
            )}
          </div>
        </section>
      </div>

      <Modal
        open={confirm}
        size="sm"
        title="Restablecer datos"
        onClose={() => setConfirm(false)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirm(false)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleReset}>Restablecer</button>
          </>
        }
      >
        <p>Se van a reemplazar todos los registros por los datos de demostración originales.</p>
      </Modal>
    </div>
  );
}
