import styles from "./EmpleadoFiltro.module.css";

export default function EmpleadoFiltro({ busqueda, setBusqueda, filtro, setFiltro, empleados, }) {
    const estados = [ "todos", "activo", "suspendido", "inactivo", ];

    return (
        <div className={`row gx-3 gy-0 align-items-center ${styles.filtros}`}>

            <div className="col-12 col-lg-4">
                <input
                type="search"
                className={`form-control ${styles.buscador}`}
                placeholder="Buscar por nombre o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar empleados"
                />
            </div>

            <div className="col-12 col-lg-8">
                <div className="d-flex flex-wrap justify-content-lg-end gap-2">

                {estados.map((estado) => {
                    const cantidad =
                    estado === "todos"
                        ? empleados.length
                        : empleados.filter(
                            (e) => e.estado === estado
                        ).length;

                    return (
                        <button
                        key={estado}
                        type="button"
                        className={`btn rounded-pill ${styles.boton} ${
                        filtro === estado ? styles.seleccionado : ""
                        }`}
                        onClick={() => setFiltro(estado)}
                        >
                            <span className={styles[estado]}>
                                ●
                            </span>

                            {" "}{estado}

                            <span className="ms-2">
                                {cantidad}
                            </span>
                        </button>
                    );
                })}
                </div>
            </div>
        </div>
    );
}
