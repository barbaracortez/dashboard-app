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
              <Route path="/" element={<Dashboard />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/oportunidades" element={<Oportunidades/>}/>
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
