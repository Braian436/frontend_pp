import { useCallback, useEffect, useMemo, useState } from "react";

import { apiRequest } from "../api/apiRequest.js";
import { AuthContext } from "./authContexto.js";
import {
    borrarSesion,
    guardarSesion,
    leerSesion,
    rutaInicio,
} from "./sesion.js";

export function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(() => leerSesion());
    const [cargando, setCargando] = useState(false);

    const login = useCallback(async ({ usuario, contrasena }) => {
        setCargando(true);
        try {
            const datos = await apiRequest("/auth/login/", {
                method: "POST",
                body: { usuario, contrasena },
                // El login no debe enviar un token viejo.
                token: "",
            });
            const nuevaSesion = {
                ...datos,
                username: datos.usuario,
            };
            guardarSesion(nuevaSesion);
            setSesion(nuevaSesion);
            return nuevaSesion;
        } finally {
            setCargando(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiRequest("/auth/logout/", { method: "POST" });
        } catch {
            // Aunque falle el servidor, cerramos la sesión local.
        }
        borrarSesion();
        setSesion(null);
    }, []);

    useEffect(() => {
        const expirar = () => {
            borrarSesion();
            setSesion(null);
        };
        if (typeof window === "undefined") return undefined;
        window.addEventListener("barberia:sesion-expirada", expirar);
        return () => window.removeEventListener("barberia:sesion-expirada", expirar);
    }, []);

    const valor = useMemo(() => ({
        sesion,
        autenticado: Boolean(sesion?.token),
        usuario: sesion?.usuario ?? "",
        nombre: sesion?.nombre ?? sesion?.usuario ?? "",
        rol: sesion?.rol ?? "",
        idEmpleado: sesion?.id_empleado ?? null,
        cargando,
        login,
        logout,
        rutaInicio: rutaInicio(sesion?.rol),
    }), [sesion, cargando, login, logout]);

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
