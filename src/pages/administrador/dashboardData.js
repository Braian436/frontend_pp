export const construirUrlDashboard = ({ fechaCaja, fechaBarberos, fechaCortes }) => {
    const parametros = new URLSearchParams({
        fecha_caja: fechaCaja,
        fecha_barberos: fechaBarberos,
        fecha_cortes: fechaCortes,
    });
    return `/dashboard/administrador/?${parametros}`;
};

export const normalizarFilas = (data, claves = []) => {
    if (Array.isArray(data)) return data;
    for (const clave of [...claves, "results", "data"]) {
        if (Array.isArray(data?.[clave])) return data[clave];
    }
    return data && typeof data === "object" ? [data] : [];
};

export const fechaFila = (fila) => {
    const valor = ["fecha", "date", "fecha_reserva", "fecha_turno", "created_at"]
        .map((clave) => fila?.[clave])
        .find(Boolean);
    return typeof valor === "string" ? valor.slice(0, 10) : "";
};

export const estadoFila = (fila) => String(
    fila?.estado ?? fila?.status ?? fila?.estado_turno ?? ""
).toLowerCase();

export const esPendiente = (estado) => estado.includes("pendiente") || estado === "pending";
export const esCompletado = (estado) => ["finalizado", "completado", "realizado", "atendido", "asistio", "presente", "done", "finished", "completed", "closed", "en_curso"].some((valor) => estado.includes(valor));
export const esCancelado = (estado) => ["cancelado", "cancelada", "anulado"].some((valor) => estado.includes(valor));

export const sumarMonto = (fila) => ["monto", "total", "importe", "ingresos", "ingreso", "caja", "valor", "cobrado", "amount", "pago"]
    .reduce((total, clave) => {
        const valor = fila?.[clave];
        if (typeof valor === "number") return total + valor;
        if (typeof valor !== "string") return total;
        const limpio = valor.replace(/\./g, "").replace(",", ".");
        return total + (Number(limpio.replace(/[^0-9.-]/g, "")) || 0);
    }, 0);

export const nombreEmpleado = (fila) => {
    const empleado = fila?.empleado ?? fila?.barbero ?? fila;
    if (typeof empleado === "string") return empleado;
    const nombre = empleado?.nombre_completo ?? empleado?.nombre ??
        `${empleado?.first_name ?? ""} ${empleado?.last_name ?? ""}`.trim();
    return nombre || empleado?.username || "Barbero";
};

export const idEmpleado = (fila) => {
    const empleado = fila?.empleado ?? fila?.barbero;
    if (typeof empleado === "object") return String(empleado?.id ?? empleado?.pk ?? empleado?.empleado_id ?? "");
    return String(empleado ?? fila?.empleado_id ?? fila?.barbero_id ?? "");
};
