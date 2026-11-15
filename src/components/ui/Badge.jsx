const TONES = {
  // éxito
  Activo: "success", Completada: "success", Ganada: "success", Generado: "success", Calificado: "success",
  // en curso
  Pendiente: "warning", Negociación: "warning", "En revisión": "warning", Contactado: "info",
  Propuesta: "info", Prospección: "info", Prospecto: "info", Nuevo: "accent",
  // negativo / inactivo
  Cancelada: "danger", Perdida: "danger", Descartado: "neutral", Inactivo: "neutral",
};

export default function Badge({ children, tone }) {
  const t = tone ?? TONES[children] ?? "neutral";
  return (
    <span className={`badge badge-${t}`}>
      <span className="badge-dot" aria-hidden="true" />
      {children}
    </span>
  );
}
