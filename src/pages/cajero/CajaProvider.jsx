import { useCallback, useEffect, useMemo, useState } from "react";

import { apiRequest } from "../../api/apiRequest.js";
import { normalizarFilas } from "./cajaData.js";
import CajaContext from "./cajaContexto.js";

async function consultarCajaAbierta(signal) {
    const data = await apiRequest(
        "/cajas/",
        signal ? { signal } : undefined
    );
    const filas = normalizarFilas(data, ["cajas"]);
    return filas.some(
        (fila) => !fila?.fecha_cierre && !fila?.fechaCierre
    );
}

export function CajaProvider({ children }) {
    const [cajaAbierta, setCajaAbierta] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        let activo = true;

        const cargar = async () => {
            try {
                const abierta = await consultarCajaAbierta(controller.signal);
                if (activo) setCajaAbierta(abierta);
            } catch (fallo) {
                if (activo && fallo.name !== "AbortError") {
                    setError(fallo.message);
                    setCajaAbierta(false);
                }
            }
        };

        void cargar();

        return () => {
            activo = false;
            controller.abort();
        };
    }, []);

    const recargar = useCallback(async () => {
        try {
            const abierta = await consultarCajaAbierta();
            setCajaAbierta(abierta);
            setError("");
            return abierta;
        } catch (fallo) {
            setError(fallo.message);
            return false;
        }
    }, []);

    const valor = useMemo(
        () => ({
            cajaAbierta,
            cargando: cajaAbierta === null,
            error,
            recargar,
            marcarCajaAbierta: setCajaAbierta,
        }),
        [cajaAbierta, error, recargar]
    );

    return (
        <CajaContext.Provider value={valor}>
            {children}
        </CajaContext.Provider>
    );
}
