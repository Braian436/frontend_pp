import { Link } from "react-router-dom";
import { FaCalendarAlt, FaIdCard, FaPen, FaPercent, FaTrash } from "react-icons/fa";
import { ESTADOS_POR_VALOR } from "../../data/empleados.js";
import {
    formatearDni,
    formatearFecha,
    obtenerIniciales,
} from "../../utils/empleados.js";
import styles from "./CardEmpleado.module.css";

export default function CardEmpleado({ empleado, onEliminar }) {
    const { id, nombre, foto, dni, estado, comisiones, fechaAlta } = empleado;
    const infoEstado = ESTADOS_POR_VALOR[estado] ?? ESTADOS_POR_VALOR.inactivo;

    return (
        <article className={styles.card}>
            <div className={styles.portada}>
                {foto ? (
                    <img
                        src={foto}
                        alt={`Foto de ${nombre}`}
                        className={styles.foto}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.sinFoto} aria-hidden="true">
                        <span>{obtenerIniciales(nombre)}</span>
                    </div>
                )}

                <span
                    className={`${styles.estadoPill} ${styles[infoEstado.valor]}`}
                    title={`Estado: ${infoEstado.etiqueta}`}
                >
                    <span className={styles.punto} aria-hidden="true" />
                    {infoEstado.etiqueta}
                </span>

                <span className={styles.comisionChip}>
                    <FaPercent aria-hidden="true" />
                    {comisiones}% comisión
                </span>
            </div>

            <div className={styles.cuerpo}>
                <h3 className={styles.nombre}>{nombre}</h3>
                <p className={styles.rol}>Empleado</p>

                <dl className={styles.detalles}>
                    <div className={styles.detalle}>
                        <dt>
                            <FaIdCard aria-hidden="true" /> DNI
                        </dt>
                        <dd>{formatearDni(dni)}</dd>
                    </div>
                    <div className={styles.detalle}>
                        <dt>
                            <FaCalendarAlt aria-hidden="true" /> Alta
                        </dt>
                        <dd>{formatearFecha(fechaAlta)}</dd>
                    </div>
                </dl>

                <div className={styles.acciones}>
                    <Link
                        to={`/empleados/editar/${id}`}
                        className={styles.botonEditar}
                        aria-label={`Editar a ${nombre}`}
                    >
                        <FaPen aria-hidden="true" />
                        Editar
                    </Link>
                    <button
                        type="button"
                        className={styles.botonEliminar}
                        onClick={() => onEliminar(empleado)}
                        aria-label={`Eliminar a ${nombre}`}
                    >
                        <FaTrash aria-hidden="true" />
                        Eliminar
                    </button>
                </div>
            </div>
        </article>
    );
}
