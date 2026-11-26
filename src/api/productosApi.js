import axios from "axios";

export const api = axios.create({
    baseURL: (import.meta.env?.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, ""),
    timeout: 10000,
});

const obtenerError = (error) => {
    const data = error.response?.data;
    const detalle = data?.detail ?? data?.non_field_errors ?? Object.values(data ?? {})[0];
    const mensaje = Array.isArray(detalle) ? detalle[0] : typeof detalle === "string" ? detalle : error.message;
    return new Error(mensaje, { cause: error });
};

export const solicitar = async (peticion) => {
    try {
        return (await peticion).data;
    } catch (error) {
        if (axios.isCancel(error)) {
            const abortError = new Error("Solicitud abortada");
            abortError.name = "AbortError";
            throw abortError;
        }
        throw obtenerError(error);
    }
};

export async function cargarDatosProductos(signal) {
    const [productos, marcas, categorias, descuentos, precios] = await Promise.all([
        solicitar(api.get("/productos/", { signal })),
        solicitar(api.get("/marcas/", { signal })),
        solicitar(api.get("/categorias/", { signal })),
        solicitar(api.get("/descuentos/", { signal })),
        solicitar(api.get("/productos/precios/", { signal })),
    ]);
    return { productos, marcas, categorias, descuentos, precios };
}

export const cargarProductosApi = (signal) => solicitar(api.get("/productos/", { signal }));
export const crearProductoApi = (producto) => solicitar(api.post("/productos/", producto));
export const editarProductoApi = (id, producto) => solicitar(api.patch(`/productos/${id}/`, producto));
export const eliminarProductoApi = (id) => solicitar(api.delete(`/productos/${id}/`));

export const listarCatalogoApi = (recurso, signal) => solicitar(api.get(`/${recurso}/`, { signal }));
export const crearCatalogoApi = (recurso, data) => solicitar(api.post(`/${recurso}/`, data));
export const editarCatalogoApi = (recurso, id, data) => solicitar(api.patch(`/${recurso}/${id}/`, data));
export const eliminarCatalogoApi = (recurso, id) => solicitar(api.delete(`/${recurso}/${id}/`));
