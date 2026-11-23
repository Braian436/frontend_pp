import styles from './CardProducto.module.css'

export default function CardProducto({ nombre, descripcion, precio, activo, onEditar, onEliminar, onCambioEstado }) {
  const handleEditar = () => {
    onEditar ? onEditar() : alert(`Editando: ${nombre}`)
  }

  const handleAgregarStock = () => {
    alert(`Agregando stock a: ${nombre}`)
  }

  const handleToggleActivo = () => {
    onCambioEstado?.(!activo)
  }

  return (
    <div className={styles.card}>
        <div className={styles.foto}>
            <span className={styles.fotoTexto}>Foto</span>
        </div>

        <div className={styles.cuerpo}>
            <div className={styles.encabezado}>
                <h5 className={styles.nombre}>{nombre}</h5>
                <span className={`${styles.indicador} ${activo ? styles.indicadorActivo : ''}`}></span>
            </div>

            <p className={styles.descripcion}>{descripcion}</p>

            <div className={styles.precioContenedor}>
                <span className={styles.precio}>${precio}</span>
            </div>

            <div className={styles.acciones}>
                <div className={styles.botones}>
                    <button type="button" className={`${styles.boton} ${styles.botonEditar}`} onClick={handleEditar}>
                        Editar
                    </button>
                    <button type="button" className={`${styles.boton} ${styles.botonStock}`} onClick={onEliminar || handleAgregarStock}>
                        {onEliminar ? "Eliminar" : "Añadir Stock"}
                    </button>
                </div>

                <div className={styles.estado}>
                    <input
                        className={styles.switch}
                        type="checkbox"
                        checked={Boolean(activo)}
                        onChange={handleToggleActivo}
                    />
                    <span className={`${styles.estadoTexto} ${activo ? styles.estadoTextoActivo : ''}`}>
                        {activo ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}
