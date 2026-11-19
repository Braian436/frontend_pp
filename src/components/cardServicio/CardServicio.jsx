import { Link } from 'react-router-dom'
import styles from './CardServicio.module.css'

export default function CardServicio({ nombre, descripcion, precio }) {
  return (
    <div className={styles.card}>
        <div className={styles.imagen}>
            <span className={styles.imagenTexto}>Imagen próximamente</span>
        </div>

        <div className={styles.contenido}>
            <h3 className={styles.nombre}>{nombre}</h3>
            <p className={styles.descripcion}>{descripcion}</p>

            <div className={styles.footer}>
                <span className={styles.precio}>${precio}</span>

                <Link to="/registrar-turno" className={styles.boton}>
                    Registrar Turno
                </Link>
            </div>
        </div>
    </div>
  )
}
