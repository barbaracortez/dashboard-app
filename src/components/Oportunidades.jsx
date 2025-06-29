import OportunidadesTable from "./OportunidadesTable";
import NuevaOportunidadForm from "./NuevaOportunidadForm";
import { useState, useEffect } from "react";

function Oportunidades() {
    const[oportunidades, setOportunidades] = useState([]);

    useEffect(()=> {
        fetch("http://localhost:3000/oportunidades")
        .then((res)=> res.json())
        .then((data)=> setOportunidades(data))
        .catch((err)=> console.err("Error:",err));
    });

    const handleNueva = (nueva) => {
        setOportunidades([...oportunidades, nueva]);
    };

    return (
        <div className ="dashboard">
            <h1>Gestión de oportunidades</h1>
            <NuevaOportunidadForm onAgregar={handleNueva}/>
            <OportunidadesTable oportunidades={oportunidades}/>
        </div>
    )
}

export default Oportunidades;
