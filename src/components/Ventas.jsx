

function Ventas () {
    return (
        <div className="dashboard">
            <h1>Panel de Ventas</h1>
            <div className="cards">
                <div className="card">
                    <h3>Total de Ventas</h3>
                    <p>$12.400</p>
                </div>
                <div className="card">
                    <h3>Ventas del mes</h3>
                    <p>$2.500</p>
                </div>
                <div className="card">
                    <h3>Pedidos Pendientes</h3>
                    <p>8</p>
                </div>
            </div>
        </div>
    );
}

export default Ventas;
