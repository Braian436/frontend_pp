const formatoFecha = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const formatoFechaHora = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

export function formatearFecha(fecha) {
    if (!fecha) return "—";

    const valor = new Date(fecha);
    return Number.isNaN(valor.getTime()) ? "—" : formatoFecha.format(valor);
}

export function formatearFechaHora(fecha) {
    if (!fecha) return "—";

    const valor = new Date(fecha);
    return Number.isNaN(valor.getTime()) ? "—" : formatoFechaHora.format(valor);
}

export function formatearDni(dni) {
    const limpio = String(dni ?? "").replace(/\D/g, "");
    return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function obtenerIniciales(nombre) {
    return String(nombre ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra.charAt(0).toUpperCase())
        .join("");
}
