import { useState, useEffect } from "react";
import ClientesTable from "./ClientesTable";
import NuevoClienteForm from "./NuevoClienteForm";

function Clientes () {
    const [clientes, setClientes] = useState([]);

        useEffect(() => {
             fetch("http://localhost:5000/clientes")
               .then((res) => res.json())
               .then((data) => setClientes(data))
               .catch((err) =>
                 console.error("Error al obtener clientes:", err)
               );
        }, []);

    const handleClienteAgregado = (nuevo) => {
        setClientes((prev) => [...prev, nuevo]);
    };

    
    return (
        <div className="dashboard">
            <h1>Panel de Clientes</h1>
            <div className="cards">
                <div className="card">
                    <h3>Total de clientes</h3>
                    <p>240</p>
                </div>
                <div className="card">
                    <h3>Clientes nuevos</h3>
                    <p>12</p>
                </div>
                <div className="card">
                    <h3>Clientes activos</h3>
                    <p>180</p>
                </div>
            </div>
            <NuevoClienteForm onClienteAgregado={handleClienteAgregado}/>
            <ClientesTable clientes={clientes}/>
        </div>
    );
}

export default Clientes;
