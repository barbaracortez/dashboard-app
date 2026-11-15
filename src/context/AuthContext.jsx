import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "crm-demo-session";

// Usuario de demostración. En un proyecto real esto se valida contra un backend.
export const DEMO_USER = {
  email: "demo@nexocrm.app",
  password: "demo1234",
  nombre: "Alex Romero",
  rol: "Gerente comercial",
};

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const login = (email, password) => {
    if (email.trim().toLowerCase() !== DEMO_USER.email || password !== DEMO_USER.password) {
      return false;
    }
    const session = { email: DEMO_USER.email, nombre: DEMO_USER.nombre, rol: DEMO_USER.rol };
    setUser(session);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // sin persistencia: la sesión dura lo que la pestaña
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignorar
    }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
