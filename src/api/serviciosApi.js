import { api, solicitar } from "./productosApi.js";

export async function cargarDatosServicios(signal) {
    const [servicios, barberos, asignaciones] = await Promise.all([
        solicitar(api.get("/servicios/", { signal })),
        solicitar(api.get("/barberos/", { signal })),
        solicitar(api.get("/empleados-servicios/", { signal })),
    ]);
    return { servicios, barberos, asignaciones };
}

export const crearServicioApi = (servicio) => solicitar(api.post("/servicios/", servicio));
export const editarServicioApi = (id, servicio) => solicitar(api.patch(`/servicios/${id}/`, servicio));
export const eliminarServicioApi = (id) => solicitar(api.delete(`/servicios/${id}/`));
export const asignarBarberoServicioApi = (data) => solicitar(api.post("/empleados-servicios/", data));
export const quitarBarberoServicioApi = (id) => solicitar(api.delete(`/empleados-servicios/${id}/`));
