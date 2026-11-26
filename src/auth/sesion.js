export const CLAVE_SESION = "barberia:sesion";

export const RUTA_POR_ROL = {
    Administrador: "/admin",
    Barbero: "/home-barbero",
    Cajero: "/cajero",
};

export function rutaInicio(rol) {
    return RUTA_POR_ROL[rol] ?? "/";
}

function almacenes() {
    const lista = [];
    try {
        if (typeof localStorage !== "undefined") lista.push(localStorage);
    } catch {
        // Algunos navegadores bloquean localStorage en modo privado.
    }
    try {
        if (typeof sessionStorage !== "undefined") lista.push(sessionStorage);
    } catch {
        // Ignoramos el almacenamiento no disponible.
    }
    return lista;
}

export function leerSesion() {
    for (const almacen of almacenes()) {
        try {
            const crudo = almacen.getItem(CLAVE_SESION);
            if (!crudo) continue;
            const sesion = JSON.parse(crudo);
            if (sesion?.token) return sesion;
        } catch {
            // Sesión corrupta: seguimos buscando en el otro almacenamiento.
        }
    }
    return null;
}

export function guardarSesion(sesion) {
    const datos = JSON.stringify(sesion);
    let guardada = false;
    for (const almacen of almacenes()) {
        try {
            almacen.setItem(CLAVE_SESION, datos);
            guardada = true;
        } catch {
            // Ignoramos el almacenamiento no disponible.
        }
    }
    return guardada;
}

export function borrarSesion() {
    for (const almacen of almacenes()) {
        try {
            almacen.removeItem(CLAVE_SESION);
        } catch {
            // Ignoramos el almacenamiento no disponible.
        }
    }
}

export function obtenerToken() {
    return leerSesion()?.token ?? "";
}
