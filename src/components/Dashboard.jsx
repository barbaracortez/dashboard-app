import Card from './Card';
import LineChartBox from './LineChartBox';

function Dashboard () {
    return (
        <div className = "dashboard">
            <h1>Dashboard General</h1>
            <div className = "cards">
                <Card title = "Ingresos" amount ="5200" color="#4e73df"/>
                <Card title = "Usuarios Nuevos" amount = "58" color="#1cc88a"/>
                <Card title = "Conversiones" amount = "12%" color="#36b9cc" />
            </div>
            <div clasName="charts">
                <LineChartBox/>
            </div>
        </div>
    )
}

export default Dashboard;