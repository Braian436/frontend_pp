const API_URL = (
    import.meta.env?.VITE_API_URL || "http://localhost:8000/api"
).replace(/\/+$/, "");

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
    if (status === 401) return "No autorizado.";
    if (status === 403) return "Acceso denegado.";
    if (status === 404) return "La ruta solicitada no existe.";
    if (typeof data?.detail === "string" && !data.detail.trim().startsWith("<")) return data.detail;
    if (typeof data?.message === "string") return data.message;

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
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");

    let body = options.body;
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
            ...options,
            headers,
            body,
        });
    } catch (error) {
        if (error.name === "AbortError") throw error;
        throw new Error("No se pudo conectar con el servidor.", { cause: error });
    }

    const data = await leerRespuesta(response);
    if (!response.ok) {
        const mensaje = mensajeErrorRespuesta(data, response.status);
        throw new ApiError(mensaje, response.status, data);
    }

    return data;
}

