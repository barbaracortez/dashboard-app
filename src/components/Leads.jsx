import LeadsTable from "./LeadsTable";
import NuevoLeadForm from "./NuevoLeadForm";
import { useState, useEffect } from "react";

function Leads() {
    const [leads, setLeads] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:3000/leads")
            .then((res)=> res.json())
            .then((data)=> setLeads(data))
            .then((err)=> console.error("Error al obtener leads:", err));
    }, []);

    const handleNuevoLead = (nuevo) => {
        setLeads((prev)=> [...prev, nuevo]);
    };

    return (
      <div className="dashboard">
        <h1>Gestion de Leads</h1>
        <div className="cards">
          <div className="card">
            <h3>Total de Leads</h3>
            <p>{leads.length}</p>
          </div>
          <div className="Card">
            <h3>Leads Nuevos</h3>
            <p>{leads.filter((l) => l.estado === "Nuevo").length}</p>
          </div>
        </div>
        <NuevoLeadForm onAgregar={handleNuevoLead}/>
        <LeadsTable  leads={leads}/>
      </div>
    );
}

export default Leads;