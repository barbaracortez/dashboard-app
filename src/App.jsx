import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Ventas from "./components/Ventas";
import Clientes from "./components/Clientes";
import Reportes from "./components/Reportes";
import Header from './components/Header';
import Footer from './components/Footer';
import Leads from "./components/Leads";
import Oportunidades from "./components/Oportunidades";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRouter";

function App() {
   const [ sidebarVisible, setSidebarVisible] = useState(true);

   useEffect(()=>{
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setSidebarVisible(false);
    }
   }, []);
   const toggleSidebar = () => {
     setSidebarVisible(!sidebarVisible);
   };
  
  return (
    <BrowserRouter>
      <div className="app">
        {sidebarVisible && <Sidebar />}
        <div className="content">
          <Header onToggleSidebar={toggleSidebar} />
          <div className="page-content">
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Rutas privadas */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ventas"
                element={
                  <PrivateRoute>
                    <Ventas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clientes"
                element={
                  <PrivateRoute>
                    <Clientes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reportes"
                element={
                  <PrivateRoute>
                    <Reportes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <PrivateRoute>
                    <Leads />
                  </PrivateRoute>
                }
              />
              <Route
                path="/oportunidades"
                element={
                  <PrivateRoute>
                    <Oportunidades />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
