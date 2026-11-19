import styles from './CardTurnos.module.css'
export default function CardTurnos({hora,nombre,servicios}) {
  return (
    <div className={styles.card}>
        <div className="card-body">
            <h5 className={styles.hora}>Hora: {hora}</h5>
            <h6 className={styles.cliente}>Cliente: {nombre}</h6>
            <p  className={styles.servicios}>Servicios: {servicios}</p>

            <div className={styles.acciones}>
                
                <button type="button" className={styles.boton}>
                    Cambiar Horario
                </button>

                <button type="button" className={`${styles.boton} ${styles.botonEliminar}`}>
                    Eliminar Turno
                </button>
            </div>
        </div>
    </div>
  )
}
