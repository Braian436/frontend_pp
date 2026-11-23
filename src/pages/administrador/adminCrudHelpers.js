export const extraerFilas = (data, clave) => {
    if (Array.isArray(data)) return data;
    for (const key of [clave, "results", "data", "items"]) {
        if (Array.isArray(data?.[key])) return data[key];
    }
    return data && typeof data === "object" ? [data] : [];
};

export const obtenerId = (item) =>
    String(item?.id ?? item?.id_empleado ?? item?.pk ?? item?.uuid ?? "");

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

export const validarCuentaEmpleado = (datos, tieneCuenta = false) => {
    const usuario = datos.usuario?.trim() ?? "";
    const contrasena = datos.contrasena ?? "";
    const grupo = datos.grupoUsuario?.trim() ?? "";
    const algunoInformado = Boolean(usuario || contrasena || grupo);
    const completa = Boolean(usuario && contrasena && grupo);

    return !tieneCuenta && algunoInformado && !completa
        ? "Completá usuario, contraseña y grupo para crear la cuenta."
        : "";
};

export const construirEmpleado = (datos) => {
    const payload = {
        nombre: datos.nombre?.trim(),
        apellido: datos.apellido?.trim(),
        id_rol: datos.id_rol === "" ? undefined : Number(datos.id_rol),
        dni: datos.dni?.trim(),
        porcentaje_comision: Number(datos.comision),
    };
    if (datos.foto && !String(datos.foto).startsWith("data:")) {
        payload.foto_empleado = datos.foto;
    }

    const usuario = datos.usuario?.trim();
    const grupo = datos.grupoUsuario?.trim();
    if (usuario) payload.usuario = usuario;
    if (datos.contrasena) payload.contrasena = datos.contrasena;
    if (grupo) payload.grupo_usuario = grupo;

    return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== null),
    );
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
    const nombre = textoObjeto(empleado?.nombre ?? empleado?.first_name ?? usuario?.first_name);
    const apellido = textoObjeto(empleado?.apellido ?? empleado?.last_name ?? usuario?.last_name);
    const nombreCompleto = textoObjeto(empleado?.nombre_completo ?? empleado?.name);
    const cuenta = empleado?.cuenta ?? {};
    const usuarioCuenta = textoObjeto(cuenta?.usuario ?? cuenta?.username ?? empleado?.username);
    const grupoUsuario = textoObjeto(cuenta?.grupo ?? cuenta?.group);
    const idRol = typeof empleado?.id_rol === "object"
        ? empleado.id_rol?.id_rol ?? empleado.id_rol?.id ?? ""
        : empleado?.id_rol ?? "";
    const grupo = textoObjeto(empleado?.rol_laboral ?? empleado?.id_rol?.nombre ?? empleado?.rol ?? empleado?.role);
    const activo = empleado?.is_active;
    const estado = empleado?.estado ?? empleado?.status ??
        (typeof activo === "boolean" ? (activo ? "activo" : "inactivo") : "activo");
    return {
        id: obtenerId(empleado),
        nombre: nombre || nombreCompleto || "Empleado",
        apellido,
        rolId: String(idRol),
        dni: textoObjeto(empleado?.dni ?? empleado?.documento ?? usuario?.dni),
        rol: grupo || "Barbero",
        estado: String(estado).toLowerCase(),
        comision: Number(empleado?.porcentaje_comision ?? empleado?.comision ?? empleado?.commission ?? 15),
        fechaAlta: textoObjeto(empleado?.fechaAlta ?? empleado?.fecha_alta ?? empleado?.date_joined) || "Automática al crear",
        foto: textoObjeto(empleado?.foto_empleado ?? empleado?.foto ?? empleado?.photo ?? empleado?.imagen),
        usuario: usuarioCuenta,
        grupoUsuario,
        tieneCuenta: Boolean(usuarioCuenta),
    };
};
