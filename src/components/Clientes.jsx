import ClientesTable from "./ClientesTable";

function Clientes () {
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
            <ClientesTable/>
        </div>
    );
}

export default Clientes;
