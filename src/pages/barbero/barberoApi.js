import { apiRequest } from "../../api/apiRequest.js";

const ESTADOS = {
    pendiente: "pendiente",
    pending: "pendiente",
    "en curso": "enCurso",
    encurso: "enCurso",
    en_curso: "enCurso",
    finalizado: "finalizado",
    finalizada: "finalizado",
    completado: "finalizado",
    completada: "finalizado",
    realizado: "finalizado",
    realizada: "finalizado",
    atendido: "finalizado",
    atendida: "finalizado",
    cancelado: "cancelado",
    cancelada: "cancelado",
    anulado: "cancelado",
    anulada: "cancelado",
};

export function normalizarEstado(valor) {
    const texto = String(valor ?? "").trim().toLowerCase();
    if (!texto) return "pendiente";
    return ESTADOS[texto] ?? texto;
}

export function claveFecha(fecha = new Date()) {
    return fecha.toLocaleDateString("en-CA");
}

export function extraerFilas(datos) {
    if (Array.isArray(datos)) return datos;
    for (const clave of ["results", "data", "turnos"]) {
        if (Array.isArray(datos?.[clave])) return datos[clave];
    }
    return [];
}

function nombreCliente(cliente) {
    if (!cliente) return "Cliente";
    if (typeof cliente === "string") return cliente.trim() || "Cliente";
    return `${cliente.nombre ?? ""} ${cliente.apellido ?? ""}`.trim() || "Cliente";
}

function nombreServicio(turno) {
    if (Array.isArray(turno.servicios)) {
        const nombres = turno.servicios
            .map((servicio) => servicio?.nombre)
            .filter(Boolean);
        if (nombres.length > 0) return nombres.join(", ");
    }
    return turno.servicio || "Servicio";
}

function horaCorta(valor) {
    if (!valor) return "";
    return String(valor).slice(0, 5);
}

export function normalizarTurno(turno) {
    return {
        id: turno.id_turno ?? turno.id,
        fecha: turno.fecha,
        horaInicio: horaCorta(turno.hora ?? turno.hora_inicio),
        horaFin: turno.hora_fin ? horaCorta(turno.hora_fin) : null,
        cliente: nombreCliente(turno.cliente),
        servicio: nombreServicio(turno),
        estado: normalizarEstado(turno.estado),
    };
}

export async function obtenerResumenBarbero({ empleado, fecha, signal } = {}) {
    const consulta = new URLSearchParams();
    if (empleado) consulta.set("empleado", empleado);
    if (fecha) consulta.set("fecha", fecha);
    const query = consulta.toString();
    return apiRequest(`/dashboard/barbero/${query ? `?${query}` : ""}`, { signal });
}

export async function listarTurnosBarbero({ empleado, fecha, signal } = {}) {
    const consulta = new URLSearchParams();
    if (empleado) consulta.set("empleado", empleado);
    if (fecha) consulta.set("fecha", fecha);
    const datos = await apiRequest(`/turnos/?${consulta}`, { signal });
    return extraerFilas(datos).map(normalizarTurno);
}
