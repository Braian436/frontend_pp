import { api, solicitar } from "./productosApi.js";

export const listarClientesApi = (signal) => solicitar(api.get("/clientes/", { signal }));
export const crearClienteApi = (cliente) => solicitar(api.post("/clientes/", cliente));
export const editarClienteApi = (id, cliente) => solicitar(api.patch(`/clientes/${id}/`, cliente));
export const eliminarClienteApi = (id) => solicitar(api.delete(`/clientes/${id}/`));
