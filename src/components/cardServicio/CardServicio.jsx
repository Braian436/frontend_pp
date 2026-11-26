import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CardServicio.module.css";

export default function CardServicio({
    nombre,
    descripcion,
    precio,
    barberos = [],
    barberosDisponibles = [],
    administracion,
    onEditar,
    onEliminar,
    onAgregarBarbero,
}) {
    const [barberoId, setBarberoId] = useState("");

    const asignar = (e) => {
        e.preventDefault();
        if (!barberoId || !onAgregarBarbero) return;
        onAgregarBarbero(barberoId);
        setBarberoId("");
    };

    return (
        <div className={styles.card}>
            <div className={styles.imagen}>
                <span className={styles.imagenTexto}>Imagen próximamente</span>
            </div>

            <div className={styles.contenido}>
                <h3 className={styles.nombre}>{nombre}</h3>
                <p className={styles.descripcion}>{descripcion}</p>

                {(barberos.length > 0 || administracion) && (
                    <div className={styles.barberosBloque}>
                        <div className={styles.barberos}>
                            {barberos.length > 0 ? barberos.map((b) => {
                                const etiqueta = typeof b === "string" ? b : b.nombre;
                                const key = typeof b === "string" ? b : b.id_empleado_servicio;
                                return (
                                    <span key={key} className={styles.barberoTag}>
                                        {etiqueta}
                                    </span>
                                );
                            }) : <span className={styles.sinBarberos}>Sin barberos asignados</span>}
                        </div>

                        {administracion && onAgregarBarbero && barberosDisponibles.length > 0 && (
                            <form className={styles.asignarForm} onSubmit={asignar}>
                                <select
                                    className={styles.selectBarbero}
                                    value={barberoId}
                                    onChange={(e) => setBarberoId(e.target.value)}
                                    aria-label={`Añadir barbero a ${nombre}`}
                                >
                                    <option value="">Añadir barbero...</option>
                                    {barberosDisponibles.map((b) => (
                                        <option key={b.id} value={b.id}>{b.nombre}</option>
                                    ))}
                                </select>
                                <button type="submit" className={styles.botonAsignar} disabled={!barberoId}>
                                    + Añadir
                                </button>
                            </form>
                        )}
                    </div>
                )}

                <div className={styles.footer}>
                    <span className={styles.precio}>${precio}</span>

                    {administracion ? (
                        <div className={styles.adminAcciones}>
                            <button type="button" className={styles.boton} onClick={onEditar}>Editar</button>
                            <button type="button" className={`${styles.boton} ${styles.botonEliminar}`} onClick={onEliminar}>Eliminar</button>
                        </div>
                    ) : (
                        <Link to="/registrar-turno" className={styles.boton}>Registrar Turno</Link>
                    )}
                </div>
            </div>
        </div>
    );
}
