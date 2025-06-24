
import "../styles/App.css";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>¡Hola, Barbara!</h1>
      </div>
      <div className="header-right">
        <input type="text" placeholder="Buscar..." className="search-input" />
      </div>
    </header>
  );
}

export default Header;
