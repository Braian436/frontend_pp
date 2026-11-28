import { api, solicitar } from "./productosApi.js";

export const listarLiquidacionesApi = (signal) =>
    solicitar(api.get("/liquidaciones/", { signal }));

export const crearLiquidacionApi = (data) =>
    solicitar(api.post("/liquidaciones/", data));

export const editarLiquidacionApi = (id, data) =>
    solicitar(api.patch(`/liquidaciones/${id}/`, data));

export const eliminarLiquidacionApi = (id) =>
    solicitar(api.delete(`/liquidaciones/${id}/`));

export const calcularLiquidacionApi = (data) =>
    solicitar(api.post("/liquidaciones/calcular/", data));
