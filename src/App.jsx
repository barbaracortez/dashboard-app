import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Ventas from "./components/Ventas";
import Clientes from "./components/Clientes";
import Reportes from "./components/Reportes";
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Header />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/reportes" element={<Reportes />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
