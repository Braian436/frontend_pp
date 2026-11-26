import { useEffect, useState } from "react";
import { LuCalendarPlus, LuCircleDollarSign, LuReceipt, LuScissors, LuTicket, LuUsers } from "react-icons/lu";
import { apiRequest } from "../../api/apiRequest.js";
import fondoAdministrador from "../../assets/fachero3.png";
import styles from "./HomeAdministrador.module.css";
import {
    construirUrlDashboard,
} from "./dashboardData.js";

const hoy = () => {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
};

function useResumenDashboard(url) {
    const [resumen, setResumen] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            setCargando(true);
            setError("");
            setResumen(null);
            try {
                const respuesta = await apiRequest(url, { signal: controller.signal });
                setResumen(respuesta);
            } catch (fallo) {
                if (fallo.name !== "AbortError") setError(fallo.message);
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };
        cargar();
        return () => controller.abort();
    }, [url]);

    return { resumen, cargando, error };
}

function Filtro({ fecha, setFecha, id }) {
    return (
        <div className={styles.filtro}>
            <label htmlFor={id}>Fecha</label>
            <input id={id} type="date" value={fecha} onChange={(evento) => setFecha(evento.target.value)} />
            {fecha === hoy() && <span>Hoy</span>}
        </div>
    );
}

const moneda = (importe) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(importe));

export default function HomeAdministrador() {
    const fechaHoy = hoy();
    const [fechaCaja, setFechaCaja] = useState(fechaHoy);
    const [fechaBarberos, setFechaBarberos] = useState(fechaHoy);
    const [fechaCortes, setFechaCortes] = useState(fechaHoy);

    const urlDashboard = construirUrlDashboard({
        fechaCaja,
        fechaBarberos,
        fechaCortes,
    });
    const { resumen, cargando, error } = useResumenDashboard(urlDashboard);
    const disponible = Boolean(resumen) && !error;

    const indicadores = [
        { titulo: "Turnos de hoy", valor: cargando ? "..." : error ? "—" : resumen.turnos_hoy.total, detalle: disponible ? `${resumen.turnos_hoy.pendientes} pendientes` : null, icono: LuCalendarPlus, color: "verde" },
        { titulo: "Caja del día", valor: disponible ? moneda(resumen.caja_hoy) : error ? "—" : "...", icono: LuCircleDollarSign, color: "verde", id: "caja" },
        { titulo: "Tickets abiertos", valor: disponible ? resumen.tickets_abiertos : error ? "—" : "...", icono: LuTicket },
        { titulo: "Liquidaciones pendientes", valor: disponible ? resumen.liquidaciones_pendientes : error ? "—" : "...", icono: LuReceipt, color: "ambar", id: "liquidaciones" },
    ];

    const estiloFondo = { backgroundImage: `linear-gradient(90deg, rgba(12,12,12,.78), rgba(12,12,12,.25)), url("${fondoAdministrador}")` };

    return (
        <div className={`min-vh-100 ${styles.dashboard}`}>
            <div className="container-fluid px-3 px-lg-5">
                <section className={`d-flex align-items-center ${styles.hero}`} style={estiloFondo}>
                    <div className={styles.heroTexto}>
                        <p className={styles.eyebrow}>Panel de administración</p>
                        <h1>Bienvenido, administrador</h1>
                        <p>Todo lo que necesitás para gestionar tu barbería, en un solo lugar.</p>
                    </div>
                </section>
            </div>

            <section className="container-fluid px-3 px-lg-5 py-4" aria-label="Estadísticas">
                {error && <p className={styles.error} role="alert">{error}</p>}
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 mb-4">
                    {indicadores.map(({ titulo, valor, detalle, icono: Icono, color, id }) => (
                        <article className={`col ${styles.indicadorResumen}`} id={id} key={titulo}>
                            <div className={`card h-100 ${styles.tarjetaIndicador}`}>
                                <div className={`card-body d-flex flex-column gap-2 ${styles.cuerpoIndicador}`}>
                                    <div className={`d-flex align-items-center justify-content-between gap-2 ${styles.indicadorEncabezado}`}>
                                        <span>{titulo}</span><Icono aria-hidden="true" />
                                    </div>
                                    <strong className={styles.valor}>{valor}</strong>
                                    {detalle && <span className={`${styles.detalle} ${styles[color]}`}>{detalle}</span>}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <h2 className={styles.tituloSeccion}>Estadísticas</h2>
                <div className="row row-cols-1 row-cols-lg-3 g-3">
                    <article className="col"><Grafico titulo="Ingresos de caja" icono={LuCircleDollarSign} filtro={<Filtro id="fecha-caja" fecha={fechaCaja} setFecha={setFechaCaja} />} cargando={cargando} disponible={disponible}>
                        <strong className={styles.valorGrafico}>{moneda(resumen?.caja.ingresos)}</strong>
                        <div className={styles.barraIngreso}><span style={{ width: Number(resumen?.caja.ingresos) > 0 ? "100%" : "0%" }} /></div>
                    </Grafico></article>
                    <article className="col"><Grafico titulo="Asistencia de barberos" icono={LuUsers} filtro={<Filtro id="fecha-barberos" fecha={fechaBarberos} setFecha={setFechaBarberos} />} cargando={cargando} disponible={disponible}>
                        <strong className={styles.valorGrafico}>{resumen?.asistencia.presentes ?? 0} / {resumen?.asistencia.total ?? 0}</strong>
                        <div className={styles.barras}>{(resumen?.asistencia.barberos ?? []).slice(0, 6).map((barbero) => {
                            return <div className={styles.barraBarbero} key={barbero.id}><span>{barbero.nombre}</span><i className={barbero.presente ? styles.presente : styles.ausente} /></div>;
                        })}</div>
                    </Grafico></article>
                    <article className="col"><Grafico titulo="Cortes realizados" icono={LuScissors} filtro={<Filtro id="fecha-cortes" fecha={fechaCortes} setFecha={setFechaCortes} />} cargando={cargando} disponible={disponible}>
                        <strong className={styles.valorGrafico}>{resumen?.cortes.realizados ?? 0}</strong>
                        <div className={styles.graficoVertical}><span style={{ height: resumen?.cortes.realizados ? "100%" : "12%" }} /></div>
                    </Grafico></article>
                </div>
            </section>
        </div>
    );
}

function Grafico({ titulo, icono: Icono, filtro, cargando, disponible, children }) {
    return (
        <div className={`card h-100 ${styles.tarjetaGrafico}`}>
            <div className={styles.encabezadoGrafico}>
                <div><Icono aria-hidden="true" /><h3>{titulo}</h3></div>{filtro}
            </div>
            {cargando ? <p className={styles.estado}>Cargando...</p> : !disponible ? <p className={styles.estado}>Datos no disponibles.</p> : <div className={styles.contenidoGrafico}>{children}</div>}
        </div>
    );
}
