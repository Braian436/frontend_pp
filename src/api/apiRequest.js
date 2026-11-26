import { obtenerToken } from "../auth/sesion.js";

const API_URL = (
    import.meta.env?.VITE_API_URL || "http://localhost:8000/api"
).replace(/\/+$/, "");

// El sitio público es anónimo: un token vencido no debe romperlo.
const RUTAS_PUBLICAS = ["/turnos/disponibilidad/", "/turnos/reservas/"];

function esRutaPublica(path) {
    return RUTAS_PUBLICAS.some((ruta) => path.startsWith(ruta));
}

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

async function leerRespuesta(response) {
    const texto = await response.text();

    if (!texto) return null;

    try {
        return JSON.parse(texto);
    } catch {
        return { detail: texto };
    }
}

export function mensajeErrorRespuesta(data, status) {
    if (typeof data?.detail === "string" && !data.detail.trim().startsWith("<")) return data.detail;
    if (typeof data?.message === "string") return data.message;

    if (status === 401) return "No autorizado.";
    if (status === 403) return "Acceso denegado.";
    if (status === 404) return "La ruta solicitada no existe.";

    const campo = data && typeof data === "object"
        ? Object.entries(data).find(([, valor]) => Array.isArray(valor) || typeof valor === "string")
        : null;
    if (campo) {
        const [nombre, valor] = campo;
        return `${nombre}: ${Array.isArray(valor) ? valor.join(", ") : valor}`;
    }
    return "No se pudo completar la solicitud.";
}

export async function apiRequest(path, options = {}) {
    const { token: tokenExplicito, ...opciones } = options;
    const headers = new Headers(opciones.headers);
    headers.set("Accept", "application/json");

    const token = tokenExplicito !== undefined
        ? tokenExplicito
        : esRutaPublica(path) ? "" : obtenerToken();
    if (token) headers.set("Authorization", `Token ${token}`);

    let body = opciones.body;
    if (
        body !== undefined &&
        !(typeof FormData !== "undefined" && body instanceof FormData)
    ) {
        headers.set("Content-Type", "application/json");
        if (typeof body !== "string") body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            ...opciones,
            credentials: "omit",
            headers,
            body,
        });
    } catch (error) {
        if (error.name === "AbortError") throw error;
        throw new Error("No se pudo conectar con el servidor.", { cause: error });
    }

    const data = await leerRespuesta(response);
    if (!response.ok) {
        if (response.status === 401 && token) {
            if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
                window.dispatchEvent(new Event("barberia:sesion-expirada"));
            }
        }
        const mensaje = mensajeErrorRespuesta(data, response.status);
        throw new ApiError(mensaje, response.status, data);
    }

    return data;
}
