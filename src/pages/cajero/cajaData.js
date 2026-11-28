export const dinero = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

export const numero = (valor) => {
    if (typeof valor === "number") return Number.isFinite(valor) ? valor : 0;
    if (typeof valor !== "string") return 0;

    const directo = Number(valor);
    if (Number.isFinite(directo)) return directo;

    const limpio = valor
        .replace(/[^0-9,.-]/g, "")
        .replace(/\.(?=\d{3}\b)/g, "")
        .replace(",", ".");

    return Number(limpio) || 0;
};

export const normalizarFilas = (data, claves = []) => {
    if (Array.isArray(data)) return data;

    for (const clave of [...claves, "results", "data", "items"]) {
        if (Array.isArray(data?.[clave])) return data[clave];
    }

    return data && typeof data === "object" ? [data] : [];
};

const texto = (valor) => {
    if (typeof valor === "string" || typeof valor === "number") return String(valor);
    return "";
};

const nombrePersona = (persona) => {
    if (!persona || typeof persona !== "object") return texto(persona);
    return [persona.nombre, persona.apellido].filter(Boolean).join(" ").trim();
};

export const horaDe = (valor) => {
    if (!valor) return "--:--";

    if (typeof valor === "string" && /^\d{2}:\d{2}/.test(valor)) {
        return valor.slice(0, 5);
    }

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return "--:--";

    return fecha.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

export const horaActual = () =>
    new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

export const fechaLarga = () => {
    const fecha = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

export const ETIQUETAS = {
    apertura: "Apertura",
    ingreso: "Ingreso",
    egreso: "Egreso",
    cobro: "Cobro",
    propina: "Propina",
    anulacion: "Anulación",
};

export const METODOS = {
    efectivo: "Efectivo",
    tarjeta: "Tarjeta",
    transferencia: "Transferencia",
};

export const normalizarMetodo = (valor) => {
    const texto = String(valor ?? "").toLowerCase();
    if (texto.includes("tarj")) return "tarjeta";
    if (texto.includes("transf")) return "transferencia";
    return "efectivo";
};


export const normalizarCaja = (fila) => {
    const cerrada = Boolean(fila?.fecha_cierre ?? fila?.fechaCierre);

    return {
        id: fila?.id_caja ?? fila?.id ?? fila?.pk ?? null,
        idEmpleado: fila?.id_empleado ?? fila?.idEmpleado ?? null,
        estado: cerrada ? "cerrada" : "abierta",
        saldoInicial: numero(fila?.saldo_inicial ?? fila?.saldoInicial),
        saldoEsperado: fila?.saldo_esperado ?? fila?.saldoEsperado ?? null,
        saldoReal: fila?.saldo_real ?? fila?.saldoReal ?? null,
        diferencia: fila?.diferencia ?? null,
        fechaInicio: horaDe(fila?.fecha_inicio ?? fila?.fechaInicio),
        fechaCierre: fila?.fecha_cierre ?? fila?.fechaCierre ?? null,
    };
};

export const normalizarMovimiento = (fila) => {
    const tipoCrudo = texto(
        fila?.tipo_movimiento ?? fila?.tipo ?? fila?.tipoMovimiento
    ).toLowerCase();
    const tipo = Object.keys(ETIQUETAS).find((clave) => tipoCrudo.includes(clave));

    return {
        id: fila?.id_movimiento_caja ?? fila?.id ?? fila?.pk ?? Date.now(),
        idVenta: fila?.id_venta ?? fila?.idVenta ?? null,
        hora: horaDe(fila?.fecha ?? fila?.hora),
        tipo: tipo ?? "ingreso",
        detalle: fila?.concepto ?? fila?.detalle ?? "Movimiento de caja",
        monto: numero(fila?.total ?? fila?.monto),
        metodo: normalizarMetodo(
            fila?.metodo_pago ?? fila?.metodo ?? fila?.medio_pago
        ),
        montoRecibido:
            fila?.monto_recibido != null
                ? numero(fila.monto_recibido)
                : fila?.montoRecibido != null
                  ? numero(fila.montoRecibido)
                  : null,
        vuelto:
            fila?.vuelto != null
                ? numero(fila.vuelto)
                : fila?.cambio != null
                  ? numero(fila.cambio)
                  : null,
    };
};

export const normalizarTicket = (fila) => {
    const cliente =
        nombrePersona(fila?.cliente ?? fila?.id_cliente) ||
        texto(fila?.cliente_nombre ?? fila?.nombre_cliente);
    const barbero =
        nombrePersona(fila?.barbero ?? fila?.empleado) ||
        nombrePersona(fila?.turno?.id_empleado) ||
        nombrePersona(fila?.id_turno?.id_empleado) ||
        texto(fila?.barbero_nombre ?? fila?.nombre_barbero);
    const detalles = fila?.detalles_servicios ?? fila?.detallesServicios ?? fila?.detalles ?? [];
    const servicios = Array.isArray(detalles) && detalles.length
        ? detalles
              .map((detalle) => detalle?.servicio?.nombre ?? detalle?.nombre ?? detalle?.id_servicio)
              .filter(Boolean)
              .join(", ")
        : texto(fila?.servicios) || "Servicio";
    const estadoCrudo = String(fila?.estado ?? "").toLowerCase();
    const cobrado =
        fila?.estado === true ||
        fila?.estado === 1 ||
        ["cobrado", "pagado", "cerrado", "finalizado"].some((valor) =>
            estadoCrudo.includes(valor)
        );
    const anulada =
        fila?.anulada === true ||
        fila?.anulada === 1 ||
        estadoCrudo === "anulada" ||
        estadoCrudo === "cancelada";
    const total = numero(fila?.subtotal ?? fila?.total ?? fila?.monto);

    let estado = "pendiente";
    if (anulada) {
        estado = cobrado ? "anulada" : "cancelada";
    } else if (cobrado) {
        estado = "cobrado";
    }

    return {
        id: fila?.id_venta ?? fila?.id ?? fila?.pk ?? Date.now(),
        idTurno: fila?.id_turno ?? fila?.idTurno ?? null,
        hora: horaDe(fila?.fecha_venta ?? fila?.fecha ?? fila?.hora),
        cliente: cliente || `Cliente ${fila?.id_cliente ?? ""}`.trim(),
        barbero: barbero || "Sin barbero",
        servicios,
        monto: total - numero(fila?.descuento),
        estado,
        metodo:
            fila?.metodo || fila?.metodo_pago || fila?.medio_pago
                ? normalizarMetodo(
                      fila?.metodo ?? fila?.metodo_pago ?? fila?.medio_pago
                  )
                : "",
        motivoAnulacion: texto(fila?.motivo_anulacion ?? fila?.motivoAnulacion),
        anuladaPor: texto(fila?.anulada_por ?? fila?.anuladaPor),
        fechaAnulacion: fila?.fecha_anulacion ?? fila?.fechaAnulacion ?? null,
    };
};

export const normalizarServicio = (fila) => ({
    id: fila?.id_servicio ?? fila?.id ?? fila?.pk ?? Date.now(),
    nombre: fila?.nombre ?? "Servicio",
    descripcion: fila?.descripcion ?? "",
    precio: numero(fila?.precio),
});

export const calcularResumen = (caja, movimientos, tickets) => {
    const sumar = (tipos) =>
        movimientos
            .filter((movimiento) => tipos.includes(movimiento.tipo))
            .reduce((total, movimiento) => total + movimiento.monto, 0);

    const esEfectivo = (movimiento) =>
        movimiento.metodo !== "tarjeta" &&
        movimiento.metodo !== "transferencia";
    const cobros = movimientos.filter((movimiento) =>
        ["ingreso", "cobro"].includes(movimiento.tipo)
    );

    const apertura = caja?.saldoInicial ?? 0;
    const anulaciones = sumar(["anulacion"]);
    const anulacionesEfectivo = movimientos
        .filter(
            (movimiento) =>
                movimiento.tipo === "anulacion" && esEfectivo(movimiento)
        )
        .reduce((total, movimiento) => total + movimiento.monto, 0);
    const ingresosBrutos = cobros.reduce(
        (total, movimiento) => total + movimiento.monto,
        0
    );
    const ingresosEfectivoBrutos = cobros
        .filter(esEfectivo)
        .reduce((total, movimiento) => total + movimiento.monto, 0);
    const ingresos = ingresosBrutos - anulaciones;
    const ingresosEfectivo = ingresosEfectivoBrutos - anulacionesEfectivo;
    const ingresosElectronicos = ingresos - ingresosEfectivo;
    const egresos = sumar(["egreso"]);
    const egresosEfectivo = movimientos
        .filter((movimiento) => movimiento.tipo === "egreso" && esEfectivo(movimiento))
        .reduce((total, movimiento) => total + movimiento.monto, 0);
    const egresosElectronicos = egresos - egresosEfectivo;
    const propinas = sumar(["propina"]);
    const pendientes = tickets.filter((ticket) => ticket.estado === "pendiente");
    const cobrados = tickets.filter((ticket) => ticket.estado === "cobrado");
    const idsAnulados = new Set(
        movimientos
            .filter((movimiento) => movimiento.tipo === "anulacion")
            .map((movimiento) => String(movimiento.idVenta ?? ""))
            .filter(Boolean)
    );
    const ventasAnuladas = tickets.filter(
        (ticket) => ticket.estado === "anulada" && idsAnulados.has(String(ticket.id))
    );
    const ticketsCancelados = tickets.filter(
        (ticket) => ticket.estado === "cancelada"
    );
    const efectivoEnCajon =
        apertura + ingresosEfectivo + propinas - egresosEfectivo;

    return {
        apertura,
        ingresos,
        ingresosBrutos,
        ingresosEfectivo,
        ingresosElectronicos,
        anulaciones,
        anulacionesEfectivo,
        egresos,
        egresosEfectivo,
        egresosElectronicos,
        propinas,
        efectivoEnCajon,
        saldoEsperado: efectivoEnCajon,
        cajaDelDia: apertura + ingresos - egresos,
        pendientes,
        cobrados,
        ventasAnuladas,
        ticketsCancelados,
        totalAnulado: anulaciones,
        totalPendiente: pendientes.reduce((total, ticket) => total + ticket.monto, 0),
        totalCobrado: cobrados.reduce((total, ticket) => total + ticket.monto, 0),
    };
};
