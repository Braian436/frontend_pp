import styles from "./TurnoItem.module.css";

const estados = {
  finalizado: { texto: "FINALIZADO", clase: styles.finalizado },
  en_curso: { texto: "EN CURSO", clase: styles.enCurso },
  pendiente: { texto: "PENDIENTE", clase: styles.pendiente },
  cancelado: { texto: "CANCELADO", clase: styles.cancelado },
};

export default function TurnoItem({ turno, onCambiarEstado }) {
  const estado = estados[turno.estado];

  const cancelar = () => {
    if (window.confirm(`¿Cancelar el turno de ${turno.cliente}?`)) {
      onCambiarEstado(turno.id, "cancelado");
    }
  };

  return (
    <div className={`p-3 ${styles.turno} ${estado.clase}`}>
      <div className="row g-2 align-items-center">
        {/* Horario */}
        <div className="col-4 col-md-2 text-center">
          <div className={`fs-4 fw-semibold lh-1 ${styles.hora}`}>{turno.inicio}</div>
          <small className="text-secondary">{turno.fin}</small>
        </div>

        {/* Cliente */}
        <div className="col-8 col-md-4">
          <p className={`fw-semibold mb-0 ${styles.cliente}`}>{turno.cliente}</p>
          <small className="text-secondary">{turno.servicio}</small>
          {turno.horaCancelacion && (
            <small className="d-block text-danger">
              Cancelado a las {turno.horaCancelacion}
            </small>
          )}
        </div>

        {/* Estado y botones */}
        <div className="col-12 col-md-6 d-flex flex-wrap align-items-center gap-2 justify-content-md-end">
          <span className={styles.estado}>{estado.texto}</span>

          {turno.estado === "pendiente" && (
            <button
              type="button"
              className="btn btn-sm btn-outline-warning"
              onClick={() => onCambiarEstado(turno.id, "en_curso")}
            >
              Iniciar
            </button>
          )}

          {(turno.estado === "pendiente" || turno.estado === "en_curso") && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={cancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}