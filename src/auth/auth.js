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

export async function apiRequest(path, token, options = {}) {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");

    if (token) headers.set("Authorization", `Token ${token}`);

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
        const mensaje =
            response.status === 401
                ? "La sesión expiró. Iniciá sesión nuevamente."
                : response.status === 403
                  ? "Acceso denegado."
                  : data?.detail || data?.message || "No se pudo completar la solicitud.";
        throw new ApiError(mensaje, response.status, data);
    }

    return data;
}

function normalizarGrupo(grupo) {
    const nombre = typeof grupo === "string" ? grupo : grupo?.name;
    const clave = nombre?.trim().toLocaleLowerCase("es");

    return {
        administrador: "Administrador",
        cajero: "Cajero",
        barbero: "Barbero",
    }[clave];
}

export function obtenerGrupo(data) {
    const usuario = data?.user ?? data?.usuario ?? data;
    const grupos =
        data?.group ??
        data?.grupo ??
        data?.role ??
        data?.rol ??
        usuario?.group ??
        usuario?.grupo ??
        usuario?.groups ??
        usuario?.grupos;
    const lista = Array.isArray(grupos) ? grupos : [grupos];

    return lista.map(normalizarGrupo).find(Boolean) ?? null;
}

function obtenerNombreUsuario(data) {
    const usuario = data?.user ?? data?.usuario ?? data;
    return (
        usuario?.username ??
        usuario?.nombre_usuario ??
        usuario?.nombre ??
        usuario?.name ??
        "Usuario"
    );
}

export async function login({ username, password }) {
    const respuesta = await apiRequest("/auth/token/", null, {
        method: "POST",
        body: { username, password },
    });

    if (typeof respuesta?.token !== "string" || !respuesta.token) {
        throw new Error("La respuesta de autenticación no contiene un token válido.");
    }

    const usuario = await apiRequest("/auth/me/", respuesta.token);
    const grupo = obtenerGrupo(usuario);

    if (!grupo) {
        throw new Error("Tu usuario no pertenece a un grupo habilitado.");
    }

    return {
        token: respuesta.token,
        usuario: obtenerNombreUsuario(usuario),
        grupo,
    };
}

export function logout(token) {
    return apiRequest("/auth/logout/", token, { method: "POST" });
}
