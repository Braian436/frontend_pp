import styles from './CardProducto.module.css'

export default function CardProducto({ producto, onEditar, onEliminar, onCambioEstado }) {
  const { nombre, descripcion, estado, stock_actual, stock_minimo, marca_nombre, categoria_nombre, descuento_nombre, costo_ultima_compra, precio_ultima_venta } = producto

  return (
    <div className={styles.card}>
        <div className={styles.foto}>
            <span className={styles.fotoTexto}>Foto</span>
        </div>

        <div className={styles.cuerpo}>
            <div className={styles.encabezado}>
                <h2 className={styles.nombre}>{nombre}</h2>
                <span className={`${styles.indicador} ${estado ? styles.indicadorActivo : ''}`} aria-hidden="true"></span>
            </div>

            <p className={styles.descripcion}>{descripcion || "Sin descripción"}</p>

            <div className={styles.detalles}>
                <p><span>Marca</span><strong>{marca_nombre}</strong></p>
                <p><span>Categoría</span><strong>{categoria_nombre}{producto.categoria_descripcion ? ` · ${producto.categoria_descripcion}` : ""}</strong></p>
                <p><span>Descuento</span><strong>{descuento_nombre} · {producto.descuento_mayorista == null ? "Tipo sin definir" : producto.descuento_mayorista ? "Mayorista" : "Minorista"} · {producto.descuento_cantidad ?? "Sin cantidad"}</strong></p>
                <p><span>Stock actual</span><strong>{stock_actual}</strong></p>
                <p><span>Stock mínimo</span><strong>{stock_minimo ?? "Sin definir"}</strong></p>
            </div>

            <div className={styles.precios}>
                <p><span>Último costo unitario</span><strong>{costo_ultima_compra == null ? "Sin compras" : `$${costo_ultima_compra}`}</strong></p>
                <p><span>Último precio de venta</span><strong>{precio_ultima_venta == null ? "Sin ventas" : `$${precio_ultima_venta}`}</strong></p>
            </div>

            <div className={styles.acciones}>
                <div className={styles.botones}>
                    <button type="button" className={`${styles.boton} ${styles.botonEditar}`} onClick={onEditar}>
                        Editar
                    </button>
                    <button type="button" className={`${styles.boton} ${styles.botonStock}`} onClick={onEliminar}>
                        Eliminar
                    </button>
                </div>

                <div className={styles.estado}>
                    <input
                        className={styles.switch}
                        type="checkbox"
                        checked={Boolean(estado)}
                        onChange={(evento) => onCambioEstado?.(evento.target.checked)}
                        aria-label={`Cambiar estado de ${nombre}`}
                    />
                    <span className={`${styles.estadoTexto} ${estado ? styles.estadoTextoActivo : ''}`}>
                        {estado ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}
