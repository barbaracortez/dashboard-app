import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./layout/AppLayout";
import Login from "./pages/Login";

// Las páginas se cargan bajo demanda para reducir el bundle inicial
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Ventas = lazy(() => import("./pages/Ventas"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Leads = lazy(() => import("./pages/Leads"));
const Oportunidades = lazy(() => import("./pages/Oportunidades"));
const Reportes = lazy(() => import("./pages/Reportes"));
const Configuracion = lazy(() => import("./pages/Configuracion"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

const page = (Component) => (
  <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
    <Component />
  </Suspense>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={page(Dashboard)} />
          <Route path="ventas" element={page(Ventas)} />
          <Route path="clientes" element={page(Clientes)} />
          <Route path="leads" element={page(Leads)} />
          <Route path="oportunidades" element={page(Oportunidades)} />
          <Route path="reportes" element={page(Reportes)} />
          <Route path="configuracion" element={page(Configuracion)} />
          <Route path="*" element={page(NotFound)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
