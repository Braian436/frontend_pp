import { Link } from "react-router-dom";
import styles from "./CardBarbero.module.css";

export default function CardBarbero( {id, nombre, especialidad, foto} ) {
    return (
        <article className={styles.card}>
            <img src={foto} alt={`Foto de ${nombre}`} className={styles.foto} />

            <div className={styles.informacion}>
                <h3 className={styles.nombre}>{nombre}</h3>
                <p className={styles.especialidad}>{especialidad}</p>
            </div>

            <Link to={`/registrar-turno?barbero=${id}`} className={styles.botonReservar}>
                Reservar Turno
            </Link>
        </article>
    )
}