import styles from "./CardAgendaTurno.module.css";

export default function CardAgendaTurno({ turno, onIniciar }) {
    return (
        <div className={styles.card}>
            <h2 className="h5 text-white">
                {turno.horaInicio} - {turno.horaFin}
            </h2>
            <p className="mb-1">Cliente: {turno.cliente}</p>
            <p className="mb-1">Servicio: {turno.servicio}</p>
            <p className="mb-3">Estado: {turno.estado}</p>

            {turno.estado === "pendiente" && (
                <button
                    type="button"
                    className={styles.botonDorado}
                    onClick={() => onIniciar(turno.id)}
                >
                    INICIAR SERVICIO
                </button>
            )}
        </div>
    );
}