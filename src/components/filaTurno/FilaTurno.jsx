import styles from "./FilaTurno.module.css";

const estados = {
    finalizado: { texto: "FINALIZADO", clase: styles.finalizado },
    en_curso: { texto: "EN CURSO", clase: styles.enCurso },
    pendiente: { texto: "PENDIENTE", clase: styles.pendiente },
};

export default function FilaTurno({ turno, onIniciar }) {
    const estado = estados[turno.estado];

    return (
        <div className={`${styles.turno} ${estado.clase}`}>
            <div>
                <div className={styles.horaInicio}>{turno.horaInicio}</div>
                <div className={styles.horaFin}>{turno.horaFin}</div>
            </div>

            <div>
                <div className={styles.cliente}>{turno.cliente}</div>
                <div className={styles.servicio}>{turno.servicio}</div>
            </div>

            <div className={styles.acciones}>
                <span className={styles.estado}>{estado.texto}</span>
                {turno.estado === "pendiente" && (
                    <button type="button" className={styles.botonIniciar} onClick={() => onIniciar(turno.id)}>
                        INICIAR SERVICIO
                    </button>
                )}
            </div>
        </div>
    );
}