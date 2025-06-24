import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

const data = [
  { name: "Enero", ventas: 400 },
  { name: "Febrero", ventas: 800 },
  { name: "Marzo", ventas: 600 },
  { name: "Abril", ventas: 1200 },
  { name: "May", ventas: 900 },
  { name: "Jun", ventas: 1600 },
];

export default function LineChartBox(){
    return (
        <div style={{ width: '100%', height:300, background: '#fff', padding: 20, borderRadius: 12}}>
            <h3>Ingresos Mensuales</h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="montone" dataKey="ventas" stroke="#4e73df" strokeWidth={3}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}