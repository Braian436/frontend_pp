import { api, solicitar } from "./productosApi.js";

export const cargarProductosCompraApi = () => solicitar(api.get("/productos/"));
export const listarComprasApi = (page = 1) => solicitar(api.get("/compras/", { params: { page } }));
export const crearCompraApi = (compra) => solicitar(api.post("/compras/", compra));
