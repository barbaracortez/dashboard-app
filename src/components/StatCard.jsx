import '../styles/App.css';

function StatCard({ title, value, bgColor }) {
    return (
        <div className="stat-card" style={{background: bgColor}}>
            <div clasName="stat-card-header">{title}</div>
            <div clasName="stat-card-header">{value}</div>
        </div>
    )
}

export default StatCard;
