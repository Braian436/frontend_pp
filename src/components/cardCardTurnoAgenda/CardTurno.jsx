import React from "react";
import styles from "./CardTurno.module.css";

const TEXTO_ESTADO = {
  finalizado: "Finalizado",
  enCurso: "En curso",
  pendiente: "Pendiente",
};

export default function CardTurno({ horaInicio, horaFin, cliente, servicio, estado, onIniciar }) {
  return (
    <article className={`${styles.cardTurno} ${styles[estado]}`}>
      <div className={styles.horario}>
        <strong className={styles.horaInicio}>{horaInicio}</strong>
        <span className={styles.horaFin}>{horaFin}</span>
      </div>

      <div className={styles.info}>
        <strong className={styles.cliente}>{cliente}</strong>
        <span className={styles.servicio}>{servicio}</span>
      </div>

      <div className={styles.acciones}>
        <span className={`${styles.etiqueta} ${styles["etiqueta_" + estado]}`}>
          {TEXTO_ESTADO[estado]}
        </span>
        {estado === "pendiente" && (
          <button className={styles.botonIniciar} onClick={onIniciar}>
            Iniciar
          </button>
        )}
      </div>
    </article>
  );
}