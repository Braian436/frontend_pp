import styles from "../../components/cardCardTurnoAgenda/CardTurno.module.css";

// Versión simplificada del card de agenda: sólo hora, cliente y servicio.
export default function TurnoResumen({ horaInicio, cliente, servicio }) {
  return (
    <article className={styles.cardTurno}>
      <div className={styles.horario}>
        <strong className={styles.horaInicio}>{horaInicio}</strong>
      </div>

      <div className={styles.info}>
        <strong className={styles.cliente}>{cliente}</strong>
        <span className={styles.servicio}>{servicio}</span>
      </div>
    </article>
  );
}
