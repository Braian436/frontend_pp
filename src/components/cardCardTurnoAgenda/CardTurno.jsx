import styles from "./CardTurno.module.css";

const TEXTO_ESTADO = {
  finalizado: "Finalizado",
  enCurso: "En curso",
  pendiente: "Pendiente",
  cancelado: "Cancelado",
};

export default function CardTurno({ horaInicio, horaFin, cliente, servicio, estado = "pendiente", onIniciar, onFinalizar }) {
  const claveEstado = TEXTO_ESTADO[estado] ? estado : "pendiente";

  return (
    <article className={`${styles.cardTurno} ${styles[claveEstado] ?? ""}`}>
      <div className={styles.horario}>
        <strong className={styles.horaInicio}>{horaInicio}</strong>
        {horaFin && <span className={styles.horaFin}>{horaFin}</span>}
      </div>

      <div className={styles.info}>
        <strong className={styles.cliente}>{cliente}</strong>
        <span className={styles.servicio}>{servicio}</span>
      </div>

      <div className={styles.acciones}>
        <span className={`${styles.etiqueta} ${styles["etiqueta_" + claveEstado] ?? ""}`}>
          {TEXTO_ESTADO[claveEstado]}
        </span>
        {claveEstado === "pendiente" && onIniciar && (
          <button className={styles.botonIniciar} onClick={onIniciar}>
            Iniciar
          </button>
        )}
        {claveEstado === "enCurso" && onFinalizar && (
          <button className={styles.botonIniciar} onClick={onFinalizar}>
            Finalizar
          </button>
        )}
      </div>
    </article>
  );
}
