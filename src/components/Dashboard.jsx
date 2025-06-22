import Card from './Card';

function Dashboard () {
    return (
        <div className = "dashboard">
            <h1>Dashboard General</h1>
            <div className = "cards">
                <Card title = "Ingresos" amount ="5200"/>
                <Card title = "Usuarios Nuevos" amount = "58"/>
                <Card title = "Conversiones" amount = "12%" />
            </div>
        </div>
    )
}

export default Dashboard;