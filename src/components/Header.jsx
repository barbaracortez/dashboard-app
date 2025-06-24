import { useState, useRef, useEffect } from 'react';
import "../styles/App.css";
import avatar from '../assets/avatar-usuario.png';

function Header() {
    const [ menuAbierto, setMenuAbierto] = useState(false);
    const avatarRef = useRef(null);


    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    }

    useEffect(()=> {
        function handleClickOutside(event) {
            if (avatarRef.current && !avatarRef.current.contains(event.target)){
                setMenuAbierto(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, []);

  return (
    <header className="header">
      <div className="header-left">
        <h1>¡Hola, Barbara!</h1>
      </div>
      <div className="header-right">
        <input type="text" placeholder="Buscar..." className="search-input" />

        <div className="avatar-container" onClick={toggleMenu} ref={avatarRef}>

          <img src={avatar} alt="Usuario" className="avatar" />
          
          {menuAbierto && (
            <div className="user-menu">
              <ul>
                <li>Mi cuenta</li>
                <li>Configuraciones</li>
                <li>Cerrar Sesión</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
