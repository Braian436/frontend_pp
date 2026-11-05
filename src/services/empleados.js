import { EMPLEADOS_INICIALES } from "../data/empleados.js";

const CLAVE_STORAGE = "barberia.empleados.v1";

function leerDelStorage() {
    try {
        const guardados = localStorage.getItem(CLAVE_STORAGE);

        if (guardados === null) {
            // Primera visita: dejamos algunos empleados de muestra.
            localStorage.setItem(CLAVE_STORAGE, JSON.stringify(EMPLEADOS_INICIALES));
            return [...EMPLEADOS_INICIALES];
        }

        const datos = JSON.parse(guardados);
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function escribirEnStorage(empleados) {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(empleados));
    } catch {
        throw new Error(
            "No se pudo guardar. La imagen puede ser demasiado grande para el almacenamiento del navegador."
        );
    }
}

function generarId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `emp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function listarEmpleados() {
    return leerDelStorage();
}

export function obtenerEmpleado(id) {
    return leerDelStorage().find((empleado) => empleado.id === id) ?? null;
}

export function crearEmpleado(datos) {
    const empleados = leerDelStorage();

    const nuevoEmpleado = {
        ...datos,
        id: generarId(),
        fechaAlta: new Date().toISOString(),
    };

    escribirEnStorage([...empleados, nuevoEmpleado]);
    return nuevoEmpleado;
}

export function actualizarEmpleado(id, datos) {
    const empleados = leerDelStorage();
    let empleadoActualizado = null;

    const siguientes = empleados.map((empleado) => {
        if (empleado.id !== id) return empleado;

        empleadoActualizado = {
            ...empleado,
            ...datos,
            id: empleado.id,
            fechaAlta: empleado.fechaAlta,
        };

        // Si en la edición se dejó la contraseña vacía, conservamos la anterior.
        if (!datos.password) {
            empleadoActualizado.password = empleado.password;
        }

        return empleadoActualizado;
    });

    escribirEnStorage(siguientes);
    return empleadoActualizado;
}

export function eliminarEmpleado(id) {
    const empleados = leerDelStorage();
    escribirEnStorage(empleados.filter((empleado) => empleado.id !== id));
}
