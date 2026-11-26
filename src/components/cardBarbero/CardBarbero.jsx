import { Link } from "react-router-dom";
import styles from "./CardBarbero.module.css";

function inicialesDe(nombre) {
    const iniciales = String(nombre ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0])
        .join("")
        .toUpperCase();
    return iniciales || "?";
}

export default function CardBarbero( {id, nombre, especialidad} ) {
    return (
        <article className={`card d-flex flex-column flex-sm-row align-items-center gap-3 p-3 w-100 ${styles.card}`}>
            <span className={styles.iniciales} aria-hidden="true">{inicialesDe(nombre)}</span>

            <div className={`flex-grow-1 text-center text-sm-start ${styles.informacion}`}>
                <h3 className={styles.nombre}>{nombre}</h3>
                <p className={styles.especialidad}>{especialidad}</p>
            </div>

            <Link to={`/turnos-disponibles?barbero=${encodeURIComponent(id)}&nombre=${encodeURIComponent(nombre)}`} className={`btn ${styles.botonReservar}`}>
                Reservar Turno
            </Link>
        </article>
    )
}