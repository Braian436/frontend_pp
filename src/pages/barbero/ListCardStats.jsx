import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest.js";
import { LuCalendarPlus, LuCircleDollarSign, LuReceipt } from "react-icons/lu";
import CardEstadisticasBarbero from '../../components/cardEstadisticasBarbero/CardEstadisticasBarbero.jsx';
import { esPendiente, estadoFila, fechaFila, normalizarFilas, sumarMonto } from "../administrador/dashboardData.js";

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

export default function ListCardStats() {

const fechaHoy = hoy();
const liquidacionesHoy = useDatos("/liquidaciones/", ["liquidaciones"], fechaHoy);
const reservasHoy = useDatos("/turnos/reservas/", ["reservas"], fechaHoy);


const reservasTurnoHoy = reservasHoy.datos.filter((fila) => !fechaFila(fila) || fechaFila(fila) === fechaHoy);
const reservasPendientes = reservasTurnoHoy.filter((fila) => esPendiente(estadoFila(fila))).length;
const liquidacionesDia = liquidacionesHoy.datos.filter((fila) => !fechaFila(fila) || fechaFila(fila) === fechaHoy);
const liquidacionesPendientes = liquidacionesDia.filter((fila) => esPendiente(estadoFila(fila))).length;
const ingresoHoy = liquidacionesDia.reduce((total, fila) => total + sumarMonto(fila), 0);


const indicadores = [
    { titulo: "Servicios Realizados por semana", valor: reservasHoy.cargando ? "..." : reservasTurnoHoy.length, detalle: `${reservasPendientes} pendientes`, icono: LuCalendarPlus, color: "verde" },
    { titulo: "Comisiones del día", valor: liquidacionesHoy.cargando ? "..." : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(ingresoHoy), icono: LuCircleDollarSign, color: "verde", id: "caja" },
    { titulo: "Total Mensual Acumulado", valor: liquidacionesHoy.cargando ? "..." : liquidacionesPendientes, icono: LuReceipt, color: "ambar", id: "liquidaciones" },
    { titulo: "Turnos de hoy", valor: liquidacionesHoy.cargando ? "..." : liquidacionesPendientes, icono: LuReceipt, color: "ambar", id: "liquidaciones" },
];
return (
<div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 mb-4">
    {indicadores.map(({ titulo, valor, detalle, icono: Icono, color, id }, indice) => (
        <CardEstadisticasBarbero
            key={`${titulo}-${indice}`}
            id={id}
            titulo={titulo}
            valor={valor}
            detalle={detalle}
            color={color}
            Icono={Icono}
        />
    ))}

    
</div>
)
}
