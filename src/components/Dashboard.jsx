import Card from './Card';
import LineChartBox from './LineChartBox';
import PierChartBox from './PieChartBox';
import OrdersTable from './OrdersTable';

function Dashboard () {
    return (
        <div className = "dashboard">
            <h1>Dashboard General</h1>
            <div className = "cards">
                <Card title = "Ingresos" amount ="5200" color="#4e73df"/>
                <Card title = "Usuarios Nuevos" amount = "58" color="#1cc88a"/>
                <Card title = "Conversiones" amount = "12%" color="#36b9cc" />
            </div>
            <div className="charts">
                <LineChartBox/>
                <PierChartBox/>
            </div>
            <OrdersTable/>
        </div>
    )
}

export default Dashboard;