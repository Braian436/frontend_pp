import { createContext, useCallback, useContext, useState } from "react";
import { apiRequest, login, logout } from "./auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(null);
    const [sesionExpirada, setSesionExpirada] = useState(false);
    const [aviso, setAviso] = useState("");

    const iniciarSesion = async (credenciales) => {
        setAviso("");
        const nuevaSesion = await login(credenciales);
        setSesion(nuevaSesion);
        setSesionExpirada(false);
    };

    const cerrarSesion = async () => {
        try {
            if (sesion?.token) await logout(sesion.token);
            setAviso("");
        } catch (error) {
            setAviso(error.message);
        } finally {
            setSesion(null);
        }
    };

    const request = useCallback(
        async (path, options) => {
            try {
                return await apiRequest(path, sesion?.token, options);
            } catch (error) {
                if (error.status === 401) {
                    setSesion(null);
                    setSesionExpirada(true);
                }
                throw error;
            }
        },
        [sesion]
    );

    return (
        <AuthContext.Provider
            value={{
                usuario: sesion?.usuario ?? null,
                grupo: sesion?.grupo ?? null,
                autenticado: Boolean(sesion?.token),
                sesionExpirada,
                aviso,
                iniciarSesion,
                cerrarSesion,
                request,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// El hook vive acá para no crear otra carpeta solo por una función.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }

    return contexto;
}
