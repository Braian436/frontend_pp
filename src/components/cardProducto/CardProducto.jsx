import { useState } from 'react'
import styles from './CardProducto.module.css'

export default function CardProducto({ nombre, descripcion, precio, activo, onEditar, onEliminar, onCambioEstado }) {
  const [estaActivo, setEstaActivo] = useState(activo)

  const handleEditar = () => {
    onEditar ? onEditar() : alert(`Editando: ${nombre}`)
  }

  const handleAgregarStock = () => {
    alert(`Agregando stock a: ${nombre}`)
  }

  const handleToggleActivo = () => {
    const nuevoEstado = !estaActivo
    setEstaActivo(nuevoEstado)
    onCambioEstado?.(nuevoEstado)
  }

  return (
    <div className={styles.card}>
        <div className={styles.foto}>
            <span className={styles.fotoTexto}>Foto</span>
        </div>

        <div className={styles.cuerpo}>
            <div className={styles.encabezado}>
                <h5 className={styles.nombre}>{nombre}</h5>
                <span className={`${styles.indicador} ${estaActivo ? styles.indicadorActivo : ''}`}></span>
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
                        checked={estaActivo}
                        onChange={handleToggleActivo}
                    />
                    <span className={`${styles.estadoTexto} ${estaActivo ? styles.estadoTextoActivo : ''}`}>
                        {estaActivo ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}
