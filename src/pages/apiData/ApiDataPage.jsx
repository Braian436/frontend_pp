import { useEffect, useState } from "react";
import { apiRequest } from "../../auth/auth.js";
import styles from "./ApiDataPage.module.css";

const horas = Array.from({ length: 13 }, (_, index) =>
    `${String(index + 10).padStart(2, "0")}:00`
);

function fechaLocal(fecha) {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

function obtenerFilas(data) {
    if (Array.isArray(data)) return data;

    for (const clave of ["results", "data", "slots", "reservas", "empleados", "liquidaciones"]) {
        if (Array.isArray(data?.[clave])) return data[clave];
    }

    return data && typeof data === "object" ? [data] : [];
}

function mostrarValor(valor) {
    if (valor === null || valor === undefined || valor === "") return "—";
    if (typeof valor === "object") return JSON.stringify(valor);
    return String(valor);
}

export default function ApiDataPage({
    title,
    description,
    endpoint,
    requiereFiltros = false,
}) {
    const request = apiRequest;
    const [filas, setFilas] = useState([]);
    const [cargando, setCargando] = useState(!requiereFiltros);
    const [error, setError] = useState("");
    const [consulta, setConsulta] = useState(null);
    const hoy = fechaLocal(new Date());
    const [empleado, setEmpleado] = useState("");
    const [desde, setDesde] = useState(hoy);
    const [hasta, setHasta] = useState(() => {
        const fin = new Date();
        fin.setDate(fin.getDate() + 5);
        return fechaLocal(fin);
    });

    useEffect(() => {
        if (requiereFiltros && consulta === null) return undefined;

        const controller = new AbortController();
        const cargar = async () => {
            setCargando(true);
            setError("");

            try {
                const url = `${endpoint}${consulta ? `?${consulta}` : ""}`;
                const data = await request(url, { signal: controller.signal });
                setFilas(obtenerFilas(data));
            } catch (fallo) {
                if (fallo.name !== "AbortError") setError(fallo.message);
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };

        cargar();
        return () => controller.abort();
    }, [consulta, endpoint, request, requiereFiltros]);

    const consultarDisponibilidad = (evento) => {
        evento.preventDefault();
        const parametros = new URLSearchParams({ empleado, desde, hasta });
        horas.forEach((hora) => parametros.append("horas", hora));
        setConsulta(parametros.toString());
    };

    const columnas = [
        ...new Set(
            filas.flatMap((fila) =>
                fila && typeof fila === "object"
                    ? Object.keys(fila)
                    : ["valor"]
            )
        ),
    ];

    return (
        <section className={styles.pagina}>
            <div className="container-fluid px-3 px-lg-5 py-4">
                <header className={styles.encabezado}>
                    <p className={styles.subtitulo}>Panel de gestión</p>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </header>

                {requiereFiltros && (
                    <form
                        className={`row align-items-end g-3 mb-4 ${styles.filtros}`}
                        onSubmit={consultarDisponibilidad}
                    >
                        <div className="col-12 col-md-4">
                            <label className="form-label" htmlFor="empleado">
                                ID del empleado
                            </label>
                            <input
                                id="empleado"
                                className="form-control"
                                value={empleado}
                                onChange={(evento) => setEmpleado(evento.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6 col-md-3">
                            <label className="form-label" htmlFor="desde">
                                Desde
                            </label>
                            <input
                                id="desde"
                                className="form-control"
                                type="date"
                                value={desde}
                                onChange={(evento) => setDesde(evento.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6 col-md-3">
                            <label className="form-label" htmlFor="hasta">
                                Hasta
                            </label>
                            <input
                                id="hasta"
                                className="form-control"
                                type="date"
                                value={hasta}
                                onChange={(evento) => setHasta(evento.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-2">
                            <button
                                className={`btn w-100 ${styles.boton}`}
                                type="submit"
                                disabled={cargando}
                            >
                                Consultar
                            </button>
                        </div>
                    </form>
                )}

                {cargando && (
                    <p className={styles.estado} role="status" aria-busy="true">
                        Cargando información...
                    </p>
                )}
                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}
                {!cargando && !error && !filas.length && (
                    <p className={styles.estado}>No hay datos para mostrar.</p>
                )}
                {!cargando && !error && filas.length > 0 && (
                    <div className={styles.tablaContenedor}>
                        <table className={`table mb-0 ${styles.tabla}`}>
                            <thead>
                                <tr>
                                    {columnas.map((columna) => (
                                        <th scope="col" key={columna}>
                                            {columna}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filas.map((fila, index) => {
                                    const registro =
                                        fila && typeof fila === "object"
                                            ? fila
                                            : { valor: fila };
                                    return (
                                        <tr key={registro.id ?? registro.pk ?? index}>
                                            {columnas.map((columna) => (
                                                <td key={columna}>
                                                    {mostrarValor(registro[columna])}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
