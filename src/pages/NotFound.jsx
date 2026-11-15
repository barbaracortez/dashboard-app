import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page not-found">
      <Compass size={40} aria-hidden="true" />
      <h1>Página no encontrada</h1>
      <p className="muted">La sección que buscás no existe o fue movida.</p>
      <Link className="btn btn-primary" to="/">Volver al dashboard</Link>
    </div>
  );
}
