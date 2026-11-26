import { LuLock, LuX } from "react-icons/lu";

import styles from "./AvisoCajaModal.module.css";

export default function AvisoCajaModal({ onCerrar, onAbrirCaja }) {
    return (
        <div className={styles.overlay}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tituloAvisoCaja"
            >
                <button
                    type="button"
                    className={styles.cerrar}
                    onClick={onCerrar}
                    aria-label="Cerrar aviso"
                >
                    <LuX aria-hidden="true" />
                </button>

                <span className={styles.icono}>
                    <LuLock aria-hidden="true" />
                </span>

                <h2 id="tituloAvisoCaja">Caja cerrada</h2>
                <p>
                    Para usar <strong>Caja, Tickets, Servicios y Asistencias</strong>{" "}
                    tenés que abrir la caja del turno.
                </p>

                <div className={styles.acciones}>
                    <button
                        type="button"
                        className={styles.secundario}
                        onClick={onCerrar}
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        className={styles.principal}
                        onClick={onAbrirCaja}
                    >
                        Abrir caja ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
