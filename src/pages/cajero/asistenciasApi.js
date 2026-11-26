import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../../api/apiRequest.js";

const ENDPOINTS = {
    dia: "/asistencias/dia/",
    asistencias: "/asistencias/",
};

const RESUMEN_VACIO = {
    total: 0,
    presentes: 0,
    ausentes: 0,
    justificados: 0,
    sin_registrar: 0,
};

export function fechaHoy() {
    const ahora = new Date();
    const desfase = ahora.getTimezoneOffset();
    return new Date(ahora.getTime() - desfase * 60000)
        .toISOString()
        .slice(0, 10);
}

export function horaActual() {
    return new Date()
        .toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .slice(0, 5);
}

export function useAsistencias() {
    const [fecha, setFecha] = useState(fechaHoy);
    const [filas, setFilas] = useState([]);
    const [resumen, setResumen] = useState(RESUMEN_VACIO);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState("");

    const cargar = useCallback(async (fechaConsulta) => {
        setCargando(true);
        setError("");
        try {
            const data = await apiRequest(
                `${ENDPOINTS.dia}?fecha=${fechaConsulta}`
            );
            setFilas(Array.isArray(data?.asistencias) ? data.asistencias : []);
            setResumen(data?.resumen ?? RESUMEN_VACIO);
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        const consultar = async () => {
            await cargar(fecha);
        };
        void consultar();
    }, [cargar, fecha]);

    const ejecutar = async (accion) => {
        setProcesando(true);
        setError("");
        try {
            await accion();
            await cargar(fecha);
            return true;
        } catch (fallo) {
            setError(fallo.message);
            return false;
        } finally {
            setProcesando(false);
        }
    };

    const registrarEntrada = (fila, observacion = "") =>
        ejecutar(() =>
            apiRequest(ENDPOINTS.asistencias, {
                method: "POST",
                body: {
                    id_empleado: fila.id_empleado,
                    estado: "presente",
                    observacion,
                },
            })
        );

    const registrarSalida = (fila) =>
        ejecutar(() =>
            apiRequest(`${ENDPOINTS.asistencias}${fila.id_asistencias}/`, {
                method: "PATCH",
                body: {
                    hora_salida: horaActual(),
                },
            })
        );

    const marcarAusencia = (fila, estado = "ausente", observacion = "") =>
        ejecutar(() => {
            if (fila.id_asistencias) {
                return apiRequest(
                    `${ENDPOINTS.asistencias}${fila.id_asistencias}/`,
                    {
                        method: "PATCH",
                        body: { estado, observacion },
                    }
                );
            }
            return apiRequest(ENDPOINTS.asistencias, {
                method: "POST",
                body: {
                    id_empleado: fila.id_empleado,
                    estado,
                    observacion,
                },
            });
        });

    const guardarRegistro = (fila, datos) =>
        ejecutar(() =>
            apiRequest(`${ENDPOINTS.asistencias}${fila.id_asistencias}/`, {
                method: "PATCH",
                body: datos,
            })
        );

    return {
        fecha,
        setFecha,
        filas,
        resumen,
        cargando,
        procesando,
        error,
        limpiarError: () => setError(""),
        recargar: () => cargar(fecha),
        registrarEntrada,
        registrarSalida,
        marcarAusencia,
        guardarRegistro,
    };
}
