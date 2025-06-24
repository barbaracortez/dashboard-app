import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const data = [
  { name: "Directo", value: 400 },
  { name: "Redes Sociales", value: 300 },
  { name: "Referencias", value: 300 },
  { name: "Email", value: 200 },
];

const COLORS = [ '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'];

export default function PierChartBox() {
    return (
      <div
        style={{
          width: "100%",
          height: 300,
          background: "#fff",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h3>Fuentes de Tráfico</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
}


