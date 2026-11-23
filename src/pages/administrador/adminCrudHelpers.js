export const extraerFilas = (data, clave) => {
    if (Array.isArray(data)) return data;
    for (const key of [clave, "results", "data", "items"]) {
        if (Array.isArray(data?.[key])) return data[key];
    }
    return data && typeof data === "object" ? [data] : [];
};

export const obtenerId = (item) => String(item?.id ?? item?.pk ?? item?.uuid ?? "");

export const rutaDetalle = (endpoint, id) => `${endpoint.replace(/\/$/, "")}/${String(id).replace(/^\//, "").replace(/\/$/, "")}/`;

export const obtenerTexto = (item, claves, fallback = "") => {
    for (const clave of claves) {
        if (item?.[clave] !== undefined && item?.[clave] !== null && item[clave] !== "") return item[clave];
    }
    return fallback;
};

export const validarCatalogo = (item) => {
    const nombre = item?.nombre ?? item?.name ?? "";
    const precio = item?.precio ?? item?.price;
    return String(nombre).trim() && (precio === undefined || precio === "" || (Number(precio) >= 0 && Number.isFinite(Number(precio))))
        ? ""
        : "Completá el nombre y un precio válido.";
};

export const construirEmpleado = (datos) => {
    const payload = {
        nombre: datos.nombre,
        dni: datos.dni,
        rol: datos.rol,
        grupo: datos.rol,
        comision: Number(datos.comision),
    };
    if (datos.estado) payload.estado = datos.estado;
    if (datos.foto) payload.foto = datos.foto;
    return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined && value !== null));
};

export const construirProducto = (datos) => ({
    nombre: datos.nombre?.trim(),
    descripcion: datos.descripcion?.trim() ?? "",
    precio: Number(datos.precio),
    activo: datos.activo === "true" || datos.activo === true,
});

export const construirServicio = (datos) => ({
    nombre: datos.nombre?.trim(),
    descripcion: datos.descripcion?.trim() ?? "",
    precio: Number(datos.precio),
});

export const normalizarActivo = (valor) =>
    valor === true || valor === "true" || valor === 1 || valor === "1";

const textoObjeto = (valor) => {
    if (typeof valor === "string" || typeof valor === "number") return String(valor);
    if (Array.isArray(valor)) return String(valor[0]?.name ?? valor[0]?.nombre ?? valor[0] ?? "");
    if (valor && typeof valor === "object") return String(valor.name ?? valor.nombre ?? valor.username ?? "");
    return "";
};

export const normalizarEmpleado = (empleado) => {
    const usuario = empleado?.user ?? empleado?.usuario ?? {};
    const nombre = textoObjeto(empleado?.nombre_completo ?? empleado?.nombre ?? empleado?.name)
        || textoObjeto(`${empleado?.first_name ?? usuario?.first_name ?? ""} ${empleado?.last_name ?? usuario?.last_name ?? ""}`.trim());
    const grupo = textoObjeto(empleado?.grupo ?? empleado?.rol ?? empleado?.role);
    const activo = empleado?.is_active;
    const estado = empleado?.estado ?? empleado?.status ??
        (typeof activo === "boolean" ? (activo ? "activo" : "inactivo") : "activo");
    return {
        id: obtenerId(empleado),
        nombre: nombre || "Empleado",
        dni: textoObjeto(empleado?.dni ?? empleado?.documento ?? usuario?.dni),
        rol: grupo || "Barbero",
        estado: String(estado).toLowerCase(),
        comision: Number(empleado?.comision ?? empleado?.commission ?? 15),
        fechaAlta: textoObjeto(empleado?.fechaAlta ?? empleado?.fecha_alta ?? empleado?.date_joined) || "Automática al crear",
        foto: textoObjeto(empleado?.foto ?? empleado?.photo ?? empleado?.imagen),
    };
};
