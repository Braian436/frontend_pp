import { Link } from "react-router-dom";
import styles from "./CardBarbero.module.css";

export default function CardBarbero( {id, nombre, especialidad, foto} ) {
    return (
        <article className={`card d-flex flex-column flex-sm-row align-items-center gap-3 p-3 w-100 ${styles.card}`}>
            <img src={foto} alt={`Foto de ${nombre}`} className={`rounded-circle object-fit-cover flex-shrink-0 ${styles.foto}`} />

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