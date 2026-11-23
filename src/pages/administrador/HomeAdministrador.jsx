import { useEffect, useState } from "react";
import { LuCalendarPlus, LuCircleDollarSign, LuReceipt, LuScissors, LuTicket, LuUsers } from "react-icons/lu";
import { apiRequest } from "../../api/apiRequest.js";
import fondoAdministrador from "../../assets/fachero3.png";
import styles from "./HomeAdministrador.module.css";
import {
    esCancelado,
    esCompletado,
    esPendiente,
    estadoFila,
    fechaFila,
    idEmpleado,
    nombreEmpleado,
    normalizarFilas,
    sumarMonto,
} from "./dashboardData.js";

const hoy = () => {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
};

function useDatos(endpoint, claves, fecha = "") {
    const request = apiRequest;
    const claveRespuesta = claves.join("|");
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            setCargando(true); setError("");
            try {
                const consulta = fecha ? `?desde=${fecha}&hasta=${fecha}` : "";
                const respuesta = await request(`${endpoint}${consulta}`, { signal: controller.signal });
                setDatos(normalizarFilas(respuesta, claveRespuesta ? claveRespuesta.split("|") : []));
            } catch (fallo) {
                if (fallo.name !== "AbortError") setError(fallo.message);
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };
        cargar();
        return () => controller.abort();
    }, [claveRespuesta, endpoint, fecha, request]);

    return { datos, cargando, error };
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

export default function HomeAdministrador() {
    const fechaHoy = hoy();
    const [fechaCaja, setFechaCaja] = useState(fechaHoy);
    const [fechaBarberos, setFechaBarberos] = useState(fechaHoy);
    const [fechaCortes, setFechaCortes] = useState(fechaHoy);

    const reservasHoy = useDatos("/turnos/reservas/", ["reservas"], fechaHoy);
    const liquidacionesHoy = useDatos("/liquidaciones/", ["liquidaciones"], fechaHoy);
    const empleados = useDatos("/empleados/", ["empleados"]);
    const caja = useDatos("/liquidaciones/", ["liquidaciones"], fechaCaja);
    const reservasBarberos = useDatos("/turnos/reservas/", ["reservas"], fechaBarberos);
    const reservasCortes = useDatos("/turnos/reservas/", ["reservas"], fechaCortes);

    const reservasTurnoHoy = reservasHoy.datos.filter((fila) => !fechaFila(fila) || fechaFila(fila) === fechaHoy);
    const liquidacionesDia = liquidacionesHoy.datos.filter((fila) => !fechaFila(fila) || fechaFila(fila) === fechaHoy);
    const reservasPendientes = reservasTurnoHoy.filter((fila) => esPendiente(estadoFila(fila))).length;
    const liquidacionesPendientes = liquidacionesDia.filter((fila) => esPendiente(estadoFila(fila))).length;
    const ingresoHoy = liquidacionesDia.reduce((total, fila) => total + sumarMonto(fila), 0);

    const liquidacionesCaja = caja.datos.filter((fila) => !fechaFila(fila) || fechaFila(fila) === fechaCaja);
    const ingresoCaja = liquidacionesCaja.reduce((total, fila) => total + sumarMonto(fila), 0);
    const listaBarberos = empleados.datos.filter((empleado) => {
        const grupo = String(empleado?.rol ?? empleado?.role ?? empleado?.grupo ?? "").toLowerCase();
        return !grupo || grupo.includes("barber");
    });
    const presentes = reservasBarberos.datos.filter((fila) =>
        esCompletado(estadoFila(fila)) && !esCancelado(estadoFila(fila))
    );
    const presentesIds = new Set(presentes.flatMap((fila) => [idEmpleado(fila), nombreEmpleado(fila)].filter(Boolean)));
    const asistentes = listaBarberos.filter((empleado) =>
        presentesIds.has(String(empleado.id ?? empleado.pk ?? "")) || presentesIds.has(nombreEmpleado(empleado))
    ).length;
    const cortes = reservasCortes.datos.filter((fila) => esCompletado(estadoFila(fila)) && !esCancelado(estadoFila(fila))).length;

    const indicadores = [
        { titulo: "Turnos de hoy", valor: reservasHoy.cargando ? "..." : reservasTurnoHoy.length, detalle: `${reservasPendientes} pendientes`, icono: LuCalendarPlus, color: "verde" },
        { titulo: "Caja del día", valor: liquidacionesHoy.cargando ? "..." : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(ingresoHoy), icono: LuCircleDollarSign, color: "verde", id: "caja" },
        { titulo: "Tickets abiertos", valor: reservasHoy.cargando ? "..." : reservasPendientes, icono: LuTicket },
        { titulo: "Liquidaciones pendientes", valor: liquidacionesHoy.cargando ? "..." : liquidacionesPendientes, icono: LuReceipt, color: "ambar", id: "liquidaciones" },
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
                {(reservasHoy.error || liquidacionesHoy.error) && <p className={styles.error} role="alert">{reservasHoy.error || liquidacionesHoy.error}</p>}
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
                    <article className="col"><Grafico titulo="Ingresos de caja" icono={LuCircleDollarSign} filtro={<Filtro id="fecha-caja" fecha={fechaCaja} setFecha={setFechaCaja} />} cargando={caja.cargando} error={caja.error}>
                        <strong className={styles.valorGrafico}>{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(ingresoCaja)}</strong>
                        <div className={styles.barraIngreso}><span style={{ width: ingresoCaja > 0 ? "100%" : "0%" }} /></div>
                    </Grafico></article>
                    <article className="col"><Grafico titulo="Asistencia de barberos" icono={LuUsers} filtro={<Filtro id="fecha-barberos" fecha={fechaBarberos} setFecha={setFechaBarberos} />} cargando={empleados.cargando || reservasBarberos.cargando} error={empleados.error || reservasBarberos.error}>
                        <strong className={styles.valorGrafico}>{asistentes} / {listaBarberos.length}</strong>
                        <div className={styles.barras}>{listaBarberos.slice(0, 6).map((empleado) => {
                            const presente = presentesIds.has(String(empleado.id ?? empleado.pk ?? "")) || presentesIds.has(nombreEmpleado(empleado));
                            return <div className={styles.barraBarbero} key={empleado.id ?? empleado.pk ?? nombreEmpleado(empleado)}><span>{nombreEmpleado(empleado)}</span><i className={presente ? styles.presente : styles.ausente} /></div>;
                        })}</div>
                    </Grafico></article>
                    <article className="col"><Grafico titulo="Cortes realizados" icono={LuScissors} filtro={<Filtro id="fecha-cortes" fecha={fechaCortes} setFecha={setFechaCortes} />} cargando={reservasCortes.cargando} error={reservasCortes.error}>
                        <strong className={styles.valorGrafico}>{cortes}</strong>
                        <div className={styles.graficoVertical}><span style={{ height: cortes ? "100%" : "12%" }} /></div>
                    </Grafico></article>
                </div>
            </section>
        </div>
    );
}

function Grafico({ titulo, icono: Icono, filtro, cargando, error, children }) {
    return (
        <div className={`card h-100 ${styles.tarjetaGrafico}`}>
            <div className={styles.encabezadoGrafico}>
                <div><Icono aria-hidden="true" /><h3>{titulo}</h3></div>{filtro}
            </div>
            {cargando ? <p className={styles.estado}>Cargando...</p> : error ? <p className={styles.error} role="alert">{error}</p> : <div className={styles.contenidoGrafico}>{children}</div>}
        </div>
    );
}
