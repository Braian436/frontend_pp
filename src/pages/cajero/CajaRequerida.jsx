import { Navigate, useLocation } from "react-router-dom";

import { useCajaContext } from "./cajaContexto.js";
import styles from "./CajaRequerida.module.css";

export default function CajaRequerida({ children }) {
    const contexto = useCajaContext();
    const location = useLocation();

    if (!contexto) {
        return children;
    }

    if (contexto.cajaAbierta === null) {
        return (
            <div className={styles.pantalla} role="status">
                <span className={styles.spinner} aria-hidden="true" />
                Verificando caja...
            </div>
        );
    }

    if (!contexto.cajaAbierta) {
        return (
            <Navigate
                to="/cajero"
                replace
                state={{
                    avisoCaja: true,
                    desde: location.pathname,
                }}
            />
        );
    }

    return children;
}
