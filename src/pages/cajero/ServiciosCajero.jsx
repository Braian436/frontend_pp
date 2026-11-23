import { useCajaApi } from "./cajaApi.js";
import { dinero } from "./cajaData.js";
import styles from "./ServiciosCajero.module.css";

export default function ServiciosCajero() {
    const { servicios, error } = useCajaApi();

    return (
        <section className={`min-vh-100 ${styles.pagina}`}>
            <div className="container-fluid px-3 px-lg-5 py-4">
                <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
                    <div>
                        <span className={styles.etiqueta}>Panel de caja</span>
                        <h1 className={styles.titulo}>Servicios</h1>
                        <p className={styles.descripcion}>
                            Consultá los servicios disponibles y sus precios.
                        </p>
                    </div>
                    <span className={styles.contador}>
                        {servicios.length} servicios
                    </span>
                </div>

                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                {servicios.length === 0 ? (
                    <p className={styles.vacio}>No hay servicios cargados.</p>
                ) : (
                    <div className="row g-3">
                        {servicios.map((servicio) => (
                            <div className="col-12 col-md-6 col-xl-3" key={servicio.id}>
                                <article className={styles.servicio}>
                                    <span className={styles.categoria}>Servicio</span>
                                    <h2>{servicio.nombre}</h2>
                                    <p>{servicio.descripcion || "Sin descripción."}</p>
                                    <div className={styles.pieServicio}>
                                        <span className={styles.detalle}>Precio</span>
                                        <strong className={styles.precio}>
                                            {dinero(servicio.precio)}
                                        </strong>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
