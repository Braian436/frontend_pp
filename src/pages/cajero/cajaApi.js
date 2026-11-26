import { useCallback, useEffect, useMemo, useState } from "react";

import { apiRequest } from "../../api/apiRequest.js";
import {
    calcularResumen,
    normalizarCaja,
    normalizarFilas,
    normalizarMetodo,
    normalizarMovimiento,
    normalizarServicio,
    normalizarTicket,
} from "./cajaData.js";

// Rutas que expone la API de cajas y ventas.
const ENDPOINTS = {
    cajas: "/cajas/",
    abrir: "/cajas/abrir/",
    movimientos: "/movimientos-cajas/",
    ventas: "/ventas/",
    servicios: "/servicios/",
};

const SESION = "barberia:sesion";

function leerUsuarioSesion() {
    try {
        const guardada =
            sessionStorage.getItem(SESION) ?? localStorage.getItem(SESION);
        if (!guardada) return "";
        const sesion = JSON.parse(guardada);
        return sesion?.username ?? "";
    } catch {
        return "";
    }
}

function cajaVacia() {
    return {
        id: null,
        idEmpleado: null,
        estado: "cerrada",
        saldoInicial: 0,
        saldoEsperado: null,
        saldoReal: null,
        diferencia: null,
        fechaInicio: "",
        fechaCierre: null,
    };
}

export function useCajaApi() {
    const [caja, setCaja] = useState(() => cajaVacia());
    const [movimientos, setMovimientos] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState("");

    const usuarioSesion = useMemo(() => leerUsuarioSesion(), []);

    const aplicarCarga = useCallback((cajas, movimientosApi, ventas) => {
        const filasCaja = normalizarFilas(cajas ?? [], ["cajas"]);
        const abierta = filasCaja.find(
            (fila) => !fila?.fecha_cierre && !fila?.fechaCierre
        );
        const elegida = abierta ?? filasCaja[0] ?? null;

        setCaja(elegida ? normalizarCaja(elegida) : cajaVacia());

        const idCaja = elegida?.id_caja ?? elegida?.id ?? null;
        let filas = normalizarFilas(movimientosApi ?? [], ["movimientos"]);
        if (idCaja != null) {
            filas = filas.filter(
                (fila) => String(fila?.id_caja ?? fila?.idCaja) === String(idCaja)
            );
        }
        setMovimientos(filas.map(normalizarMovimiento));

        setTickets(
            normalizarFilas(ventas ?? [], ["ventas"]).map(normalizarTicket)
        );
    }, []);

    const recargar = useCallback(async () => {
        const pedir = (ruta) => apiRequest(ruta).catch(() => null);
        const [cajas, movimientosApi, ventas] = await Promise.all([
            pedir(ENDPOINTS.cajas),
            pedir(ENDPOINTS.movimientos),
            pedir(ENDPOINTS.ventas),
        ]);
        if (cajas !== null) aplicarCarga(cajas, movimientosApi, ventas);
    }, [aplicarCarga]);

    useEffect(() => {
        const controller = new AbortController();
        let activo = true;

        const cargar = async () => {
            setCargando(true);
            const pedir = (ruta) =>
                apiRequest(ruta, { signal: controller.signal }).catch(() => null);

            const [cajas, movimientosApi, ventas, serviciosApi] =
                await Promise.all([
                    pedir(ENDPOINTS.cajas),
                    pedir(ENDPOINTS.movimientos),
                    pedir(ENDPOINTS.ventas),
                    pedir(ENDPOINTS.servicios),
                ]);

            if (!activo) return;

            if (cajas === null) {
                setError("No se pudo cargar la información de caja.");
            } else {
                aplicarCarga(cajas, movimientosApi, ventas);
            }
            if (serviciosApi) {
                setServicios(
                    normalizarFilas(serviciosApi, ["servicios"]).map(
                        normalizarServicio
                    )
                );
            }
            setCargando(false);
        };

        void cargar();

        return () => {
            activo = false;
            controller.abort();
        };
    }, [aplicarCarga]);

    const resumen = useMemo(
        () => calcularResumen(caja, movimientos, tickets),
        [caja, movimientos, tickets]
    );

    const limpiarError = () => setError("");

    const abrirCaja = async ({ usuario, contrasena, monto }) => {
        const saldoInicial = Number(monto) || 0;
        setError("");
        setProcesando(true);
        try {
            await apiRequest(ENDPOINTS.abrir, {
                method: "POST",
                body: {
                    usuario: usuario?.trim() ?? "",
                    contrasena: contrasena ?? "",
                    saldo_inicial: saldoInicial,
                },
            });
        } catch (fallo) {
            setError(fallo.message);
            setProcesando(false);
            return false;
        }
        setProcesando(false);
        await recargar();
        return true;
    };

    const registrarMovimiento = async ({
        tipo,
        monto,
        concepto,
        metodo = "efectivo",
        montoRecibido = null,
    }) => {
        const total = Number(monto);
        if (!total || total <= 0) return false;

        const metodoPago = normalizarMetodo(metodo);
        const recibido =
            tipo === "ingreso" &&
            metodoPago === "efectivo" &&
            montoRecibido != null
                ? Number(montoRecibido)
                : null;
        const vuelto = recibido != null ? Math.max(0, recibido - total) : null;
        const detalle =
            concepto?.trim() ||
            (tipo === "egreso" ? "Egreso manual" : "Ingreso manual");

        setError("");
        setProcesando(true);
        try {
            await apiRequest(ENDPOINTS.movimientos, {
                method: "POST",
                body: {
                    id_caja: caja?.id ?? null,
                    total,
                    tipo_movimiento: tipo,
                    concepto: detalle,
                    metodo_pago: metodoPago,
                    monto_recibido: recibido,
                    vuelto,
                },
            });
        } catch (fallo) {
            setError(fallo.message);
            setProcesando(false);
            return false;
        }
        setProcesando(false);
        await recargar();
        return true;
    };

    const cerrarCaja = async ({ usuario, contrasena, saldoReal }) => {
        if (!caja?.id) {
            setError("No hay una caja abierta para cerrar.");
            return false;
        }
        setError("");
        setProcesando(true);
        try {
            await apiRequest(`${ENDPOINTS.cajas}${caja.id}/cerrar/`, {
                method: "POST",
                body: {
                    usuario: usuario?.trim() ?? "",
                    contrasena: contrasena ?? "",
                    saldo_real: Number(saldoReal) || 0,
                },
            });
        } catch (fallo) {
            setError(fallo.message);
            setProcesando(false);
            return false;
        }
        setProcesando(false);
        await recargar();
        return true;
    };

    const cobrarTicket = async (
        id,
        { metodo = "efectivo", montoRecibido = null } = {}
    ) => {
        const metodoPago = normalizarMetodo(metodo);
        const recibido =
            metodoPago === "efectivo"
                ? montoRecibido != null
                    ? Number(montoRecibido)
                    : null
                : null;

        setError("");
        setProcesando(true);
        try {
            await apiRequest(`${ENDPOINTS.ventas}${id}/cobrar/`, {
                method: "POST",
                body: { metodo_pago: metodoPago, monto_recibido: recibido },
            });
        } catch (fallo) {
            setError(fallo.message);
            setProcesando(false);
            return false;
        }
        setProcesando(false);
        await recargar();
        return true;
    };

    const crearTicket = async (datos) => {
        setError("");
        setProcesando(true);
        try {
            await apiRequest(`${ENDPOINTS.ventas}crear-ticket/`, {
                method: "POST",
                body: datos,
            });
        } catch (fallo) {
            setError(fallo.message);
            setProcesando(false);
            return false;
        }
        setProcesando(false);
        await recargar();
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
        procesando,
        error,
        usuarioSesion,
        limpiarError,
        abrirCaja,
        cerrarCaja,
        registrarMovimiento,
        cobrarTicket,
        crearTicket,
    };
}
