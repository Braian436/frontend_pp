import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest.js";
import { extraerFilas, obtenerId, rutaDetalle } from "./adminCrudHelpers.js";

export { construirEmpleado, construirProducto, construirServicio, extraerFilas, normalizarActivo, normalizarEmpleado, obtenerId, obtenerTexto, rutaDetalle, validarCatalogo } from "./adminCrudHelpers.js";

export function useCrudApi(endpoint, clave) {
    const request = apiRequest;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const listar = useCallback(async (signal) => {
        setLoading(true); setError("");
        try {
            const data = await request(endpoint, signal ? { signal } : undefined);
            setItems(extraerFilas(data, clave));
        } catch (fallo) {
            if (fallo.name !== "AbortError") setError(fallo.message);
        } finally {
            setLoading(false);
        }
    }, [clave, endpoint, request]);

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await request(endpoint, { signal: controller.signal });
                setItems(extraerFilas(data, clave));
            } catch (fallo) {
                if (fallo.name !== "AbortError") setError(fallo.message);
            } finally {
                setLoading(false);
            }
        };
        void cargar();
        return () => controller.abort();
    }, [clave, endpoint, request]);

    const mutar = useCallback(async (method, body, item) => {
        const id = item ? obtenerId(item) : "";
        if (method !== "POST" && !id) {
            setError("No se pudo identificar el registro.");
            return false;
        }
        setSaving(true); setError("");
        try {
            await request(id ? rutaDetalle(endpoint, id) : endpoint, {
                method,
                body,
            });
            await listar();
            return true;
        } catch (fallo) {
            setError(fallo.message);
            return false;
        } finally {
            setSaving(false);
        }
    }, [endpoint, listar, request]);

    return { items, loading, error, saving, refresh: listar, crear: (body) => mutar("POST", body), editar: (item, body) => mutar("PATCH", body, item), eliminar: (item) => mutar("DELETE", undefined, item) };
}
