const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const TOKEN_URL = `${API_URL}/api/token/`;
const SESSION_KEY = "barberia:sesion";

export function getSession() {
    // "Recordarme" guarda en localStorage; sin marcar, en sessionStorage.
    const guardada =
        sessionStorage.getItem(SESSION_KEY) ??
        localStorage.getItem(SESSION_KEY);

    if (!guardada) return null;

    try {
        return JSON.parse(guardada);
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
}

function saveSession(session, remember) {
    const destino = remember ? localStorage : sessionStorage;
    const otro = remember ? sessionStorage : localStorage;

    destino.setItem(SESSION_KEY, JSON.stringify(session));
    otro.removeItem(SESSION_KEY);
}

export async function login({ username, password }, remember) {
    let response;

    try {
        response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor.");
    }

    if (response.status === 401) {
        throw new Error("Usuario o contraseña incorrectos.");
    }

    if (!response.ok) {
        throw new Error("No se pudo iniciar sesión. Intentá nuevamente.");
    }

    const data = await response.json();

    if (!data.access || !data.refresh) {
        throw new Error("La respuesta del servidor no es válida.");
    }

    // SimpleJWT devuelve access (para las peticiones) y refresh (para renovarlo).
    const session = {
        access: data.access,
        refresh: data.refresh,
        username,
    };

    saveSession(session, remember);
    return session;
}
