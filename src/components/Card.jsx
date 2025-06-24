
function Card({ title, amount, color}) {
    return (
        <div className="card" style={{ backgroundColor: color }}>
            <h3>{title}</h3>
            <p>{amount}</p>
        </div>
    )
}

export default Card;