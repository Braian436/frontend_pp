import { useEffect, useMemo, useState } from "react";

import { demo } from "./cajaDemo.js";
import {
    calcularResumen,
    horaActual,
    normalizarCaja,
    normalizarFilas,
    normalizarMetodo,
    normalizarMovimiento,
    normalizarServicio,
    normalizarTicket,
} from "./cajaData.js";

// Rutas que va a exponer la API cuando estén creadas las vistas de cajas.
const ENDPOINTS = {
    cajas: "/cajas/",
    movimientos: "/movimientos-cajas/",
    ventas: "/ventas/",
    servicios: "/servicios/",
};

// Los campos metodo, montoRecibido y vuelto se guardan solo en el estado demo.
// Cuando la API los soporte, incluirlos en los POST como metodo_pago,
// monto_recibido y vuelto.

const clonar = (valor) => JSON.parse(JSON.stringify(valor));

export function useCajaApi() {
    const [caja, setCaja] = useState(() => clonar(demo.caja));
    const [movimientos, setMovimientos] = useState(() => clonar(demo.movimientos));
    const [tickets, setTickets] = useState(() => clonar(demo.tickets));
    const [servicios, setServicios] = useState(() => clonar(demo.servicios));
    const [modoDemo, setModoDemo] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        let activo = true;

        const cargar = async () => {
            setCargando(true);
            const pedir = (ruta) =>
                apiRequest(ruta, { signal: controller.signal }).catch(() => null);

            const [cajas, movimientosApi, ventas, serviciosApi] = await Promise.all([
                pedir(ENDPOINTS.cajas),
                pedir(ENDPOINTS.movimientos),
                pedir(ENDPOINTS.ventas),
                pedir(ENDPOINTS.servicios),
            ]);

            if (!activo) return;

            const filasCaja = normalizarFilas(cajas ?? [], ["cajas"]);
            if (filasCaja.length) {
                const abierta = filasCaja.find(
                    (fila) => !fila?.fecha_cierre && !fila?.fechaCierre
                );
                const siguienteCaja = normalizarCaja(abierta ?? filasCaja[0]);
                demo.caja = siguienteCaja;
                setCaja(siguienteCaja);
                setModoDemo(false);

                if (movimientosApi) {
                    const filasMovimientos = normalizarFilas(movimientosApi, [
                        "movimientos",
                    ]).map(normalizarMovimiento);
                    demo.movimientos = filasMovimientos;
                    setMovimientos(filasMovimientos);
                }
                if (ventas) {
                    const filasVentas = normalizarFilas(ventas, ["ventas"]).map(
                        normalizarTicket
                    );
                    demo.tickets = filasVentas;
                    setTickets(filasVentas);
                }
                if (serviciosApi) {
                    const filasServicios = normalizarFilas(serviciosApi, [
                        "servicios",
                    ]).map(normalizarServicio);
                    demo.servicios = filasServicios;
                    setServicios(filasServicios);
                }
            }

            setCargando(false);
        };

        void cargar();

        return () => {
            activo = false;
            controller.abort();
        };
    }, []);

    const resumen = useMemo(
        () => calcularResumen(caja, movimientos, tickets),
        [caja, movimientos, tickets]
    );

    const guardarCaja = (siguiente) => {
        demo.caja = siguiente;
        setCaja(siguiente);
    };

    const guardarMovimientos = (siguientes) => {
        demo.movimientos = siguientes;
        setMovimientos(siguientes);
    };

    const guardarTickets = (siguientes) => {
        demo.tickets = siguientes;
        setTickets(siguientes);
    };

    const enviar = async (ruta, opciones) => {
        if (modoDemo) return;

        setError("");
        try {
            await apiRequest(ruta, opciones);
        } catch (fallo) {
            setError(fallo.message);
        }
    };

    const abrirCaja = (saldoInicial) => {
        const monto = Number(saldoInicial) || 0;
        const siguiente = {
            id: caja?.id ?? Date.now(),
            idEmpleado: caja?.idEmpleado ?? null,
            estado: "abierta",
            saldoInicial: monto,
            saldoEsperado: null,
            saldoReal: null,
            diferencia: null,
            fechaInicio: horaActual(),
            fechaCierre: null,
        };

        guardarCaja(siguiente);
        guardarMovimientos([
            {
                id: Date.now(),
                hora: horaActual(),
                tipo: "apertura",
                detalle: "Apertura de caja",
                monto,
                metodo: "efectivo",
            },
            ...movimientos,
        ]);
        void enviar(ENDPOINTS.cajas, {
            method: "POST",
            body: {
                id_empleado: siguiente.idEmpleado,
                fecha_inicio: new Date().toISOString(),
                saldo_inicial: monto,
                saldo_esperado: monto,
            },
        });
    };

    const registrarMovimiento = ({
        tipo,
        monto,
        concepto,
        metodo = "efectivo",
        montoRecibido = null,
    }) => {
        const total = Number(monto);
        if (!total || total <= 0) return false;

        const metodoPago =
            tipo === "ingreso" ? normalizarMetodo(metodo) : "efectivo";
        const recibido =
            metodoPago === "efectivo" && montoRecibido != null
                ? Number(montoRecibido)
                : null;
        const vuelto =
            recibido != null ? Math.max(0, recibido - total) : null;
        const detalle =
            concepto?.trim() ||
            (tipo === "egreso" ? "Egreso manual" : "Ingreso manual");

        guardarMovimientos([
            {
                id: Date.now(),
                hora: horaActual(),
                tipo,
                detalle,
                monto: total,
                metodo: metodoPago,
                montoRecibido: recibido,
                vuelto,
            },
            ...movimientos,
        ]);
        void enviar(ENDPOINTS.movimientos, {
            method: "POST",
            body: {
                id_caja: caja?.id ?? null,
                total,
                fecha: new Date().toISOString(),
                tipo_movimiento: tipo,
                concepto: detalle,
                // TODO API: agregar metodo_pago, monto_recibido y vuelto
                // cuando movimientos_cajas tenga esas columnas.
            },
        });

        return true;
    };

    const cerrarCaja = ({ saldoReal, observacion }) => {
        const real = Number(saldoReal) || 0;
        const esperado = resumen.saldoEsperado;
        const siguiente = {
            ...caja,
            estado: "cerrada",
            saldoEsperado: esperado,
            saldoReal: real,
            diferencia: real - esperado,
            fechaCierre: new Date().toISOString(),
            observacion: observacion?.trim() ?? "",
        };

        guardarCaja(siguiente);

        if (caja?.id) {
            void enviar(`${ENDPOINTS.cajas}${caja.id}/`, {
                method: "PATCH",
                body: {
                    fecha_cierre: new Date().toISOString(),
                    saldo_esperado: esperado,
                    saldo_real: real,
                    diferencia: real - esperado,
                },
            });
        }
    };

    const cobrarTicket = (
        id,
        { metodo = "efectivo", montoRecibido = null } = {}
    ) => {
        const ticket = tickets.find(
            (item) => item.id === id && item.estado === "pendiente"
        );
        if (!ticket) return false;

        const metodoPago = normalizarMetodo(metodo);
        const recibido =
            metodoPago === "efectivo"
                ? Number(montoRecibido ?? ticket.monto)
                : null;
        const vuelto =
            recibido != null ? Math.max(0, recibido - ticket.monto) : null;

        guardarTickets(
            tickets.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          estado: "cobrado",
                          metodo: metodoPago,
                          montoRecibido: recibido,
                          vuelto,
                      }
                    : item
            )
        );
        guardarMovimientos([
            {
                id: Date.now(),
                hora: horaActual(),
                tipo: "cobro",
                detalle: `Ticket de ${ticket.cliente}`,
                monto: ticket.monto,
                metodo: metodoPago,
                montoRecibido: recibido,
                vuelto,
            },
            ...movimientos,
        ]);

        if (!modoDemo) {
            const fecha = new Date().toISOString();
            void enviar(`${ENDPOINTS.ventas}${id}/`, {
                method: "PATCH",
                body: {
                    estado: true,
                    fecha_cierre: fecha,
                },
            });
            void enviar(ENDPOINTS.movimientos, {
                method: "POST",
                body: {
                    id_caja: caja?.id ?? null,
                    id_venta: id,
                    total: ticket.monto,
                    fecha,
                    tipo_movimiento: "cobro",
                    concepto: `Ticket de ${ticket.cliente}`,
                    // TODO API: agregar metodo_pago, monto_recibido y vuelto
                    // cuando movimientos_cajas tenga esas columnas.
                },
            });
        }

        return true;
    };

    return {
        caja,
        estado: caja.estado,
        movimientos,
        tickets,
        servicios,
        resumen,
        cargando,
        error,
        modoDemo,
        abrirCaja,
        cerrarCaja,
        registrarMovimiento,
        cobrarTicket,
    };
}
