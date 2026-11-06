import styles from './EmpleadoCard.module.css'

export default function EmpleadoCard( { empleado, onEditar, onEliminar } ) {
    const iniciales = empleado.nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase();

    const estadoClase = {
    activo: styles.activo,
    suspendido: styles.suspendido,
    inactivo: styles.inactivo,
    };

    return (
        <div className={`card h-100 ${styles.card}`}>

            <div className={styles.portada}>
                <span className={`badge rounded-pill ${styles.estado} ${ estadoClase[empleado.estado] || ""}`} >
                    ● {empleado.estado}
                </span>

                <div className={styles.avatar}>
                {empleado.foto ? (
                    <img src={empleado.foto} alt={empleado.nombre} className="w-100 h-100" />
                ) : (
                    <span>{iniciales}</span>
                )}
                </div>

                <span className={`badge ${styles.comision}`}>
                    {empleado.comision}% comisión
                </span>
            </div>

            <div className="card-body d-flex flex-column">

                <h5 className={styles.nombre}>
                    {empleado.nombre}
                </h5>

                <p className={styles.rol}>
                    {empleado.rol}
                </p>

                <div className="row g-2 mt-2 mb-3">

                    <div className="col-6">
                        <div className={styles.dato}>
                            <small>DNI</small>
                            <strong>{empleado.dni}</strong>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className={styles.dato}>
                            <small>ALTA</small>
                            <strong>{empleado.fechaAlta}</strong>
                        </div>
                    </div>

                </div>

                <div className="d-flex gap-2 mt-auto">

                    <button
                        type="button"
                        className={`btn flex-fill ${styles.botonEditar}`}
                        onClick={() => onEditar(empleado)}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        className={`btn flex-fill ${styles.botonEliminar}`}
                        onClick={() => onEliminar(empleado)}
                    >
                        Eliminar
                    </button>

                </div>
            </div>
        </div>
    );
}
