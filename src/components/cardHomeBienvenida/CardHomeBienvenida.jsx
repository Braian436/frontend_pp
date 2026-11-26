import styles from "./CardHomeBienvenida.module.css"


export default function CardHomeBienvenida({ titulo, descripcion, detalle }) {
  return (
    <section className={`${styles.banner} mb-4`}>
      <div className={styles.bannerTexto}>
        <p className={styles.etiqueta}>{titulo}</p>
        <h1 className={styles.titulo}>{descripcion}</h1>
        <p className={styles.subtitulo}>{detalle}</p>
      </div>
    </section>
  )
}
