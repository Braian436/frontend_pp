import TurnoItem from "../turnoItem/TurnoItem";
import styles from "./AgendaCard.module.css";

export default function AgendaCard({ barbero, fecha, onReservar, onCambiarEstado }) {
  const contar = (estado) =>
    barbero.turnos.filter((t) => t.estado === estado).length;

  return (
    <div className={`card mb-4 ${styles.card}`}>
      <div className="card-body p-3 p-md-4">
        {/* Barbero */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className={styles.avatar}>{barbero.nombre.charAt(0)}</div>
          <div>
            <h2 className="h4 text-white mb-0">{barbero.nombre}</h2>
            <p className="text-secondary mb-0">{barbero.especialidad}</p>
          </div>
        </div>

        {/* Fecha */}
        <div className={`text-center text-white rounded py-2 mb-3 ${styles.fecha}`}>
          {fecha}
        </div>

        {/* Resumen */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge rounded-pill text-bg-success">
            {contar("finalizado")} finalizados
          </span>
          <span className="badge rounded-pill text-bg-warning">
            {contar("en_curso")} en curso
          </span>
          <span className="badge rounded-pill text-bg-secondary">
            {contar("pendiente")} pendientes
          </span>
          <span className="badge rounded-pill text-bg-danger">
            {contar("cancelado")} cancelados
          </span>
        </div>

        {/* Turnos */}
        <div className="d-flex flex-column gap-3">
          {barbero.turnos.map((turno) => (
            <TurnoItem
              key={turno.id}
              turno={turno}
              onCambiarEstado={(turnoId, estado) =>
                onCambiarEstado(barbero.id, turnoId, estado)
              }
            />
          ))}
        </div>

        {/* Botón */}
        <div className="d-grid d-sm-flex justify-content-sm-center mt-4">
          <button
            type="button"
            className={`btn ${styles.botonDorado}`}
            onClick={() => onReservar(barbero)}
          >
            RESERVAR TURNO
          </button>
        </div>
      </div>
    </div>
  );
}
