import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../auth/useAuth.js";

export default function RutaProtegida({ roles, children }) {
    const { autenticado, rol, rutaInicio } = useAuth();
    const { pathname, search } = useLocation();

    if (!autenticado) {
        const destino = encodeURIComponent(`${pathname}${search}`);
        return <Navigate to={`/login?redirect=${destino}`} replace />;
    }

    if (Array.isArray(roles) && roles.length > 0 && !roles.includes(rol)) {
        return <Navigate to={rutaInicio} replace />;
    }

    return children;
}
