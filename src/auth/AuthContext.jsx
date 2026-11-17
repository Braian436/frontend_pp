import { createContext, useContext, useState } from "react";
import { getSession, login, logout } from "./auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(
        () => getSession()?.username ?? null
    );

    const iniciarSesion = async (credenciales, recordar) => {
        const sesion = await login(credenciales, recordar);
        setUsuario(sesion.username);
    };

    const cerrarSesion = () => {
        logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado: Boolean(usuario),
                iniciarSesion,
                cerrarSesion,
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
