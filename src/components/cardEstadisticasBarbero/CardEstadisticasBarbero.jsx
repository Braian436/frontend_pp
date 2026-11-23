import React from 'react'
import styles from "./CardEstadisticasBarbero.module.css";

export default function CardEstadisticasBarbero({id,titulo,valor,detalle,Icono,color}) {
  return (
    <article className={`col ${styles.indicadorResumen}`} id={id} key={titulo}>
        <div className={`card h-100 ${styles.tarjetaIndicador}`}>
            <div className={`card-body d-flex flex-column gap-2 ${styles.cuerpoIndicador}`}>
                <div className={`d-flex align-items-center justify-content-between gap-2 ${styles.indicadorEncabezado}`}>
                    <span>{titulo}</span>{Icono && <Icono aria-hidden="true" />}
                </div>
                <strong className={styles.valor}>{valor}</strong>
                {detalle && <span className={`${styles.detalle} ${styles[color]}`}>{detalle}</span>}
            </div>
        </div>
    </article>
  )
}
