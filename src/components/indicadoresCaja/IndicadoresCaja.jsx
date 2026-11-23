import styles from "./IndicadoresCaja.module.css";

export default function IndicadoresCaja({
    indicadores,
    etiqueta = "Resumen de la caja",
}) {
    return (
        <div
            className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 mb-4"
            aria-label={etiqueta}
        >
            {indicadores.map(
                ({ titulo, valor, detalle, icono: Icono, color, barra }) => (
                    <article className={`col ${styles.indicador}`} key={titulo}>
                        <div className={`card h-100 ${styles.tarjeta}`}>
                            <div
                                className={`card-body d-flex flex-column gap-2 ${styles.cuerpo}`}
                            >
                                <div
                                    className={`d-flex align-items-center justify-content-between gap-2 ${styles.encabezado}`}
                                >
                                    <span>{titulo}</span>
                                    <Icono aria-hidden="true" />
                                </div>
                                <strong className={styles.valor}>{valor}</strong>
                                <span
                                    className={`${styles.detalle} ${
                                        color ? styles[color] : ""
                                    }`}
                                >
                                    {detalle}
                                </span>
                                {barra && (
                                    <span className={styles.barra} aria-hidden="true" />
                                )}
                            </div>
                        </div>
                    </article>
                )
            )}
        </div>
    );
}
