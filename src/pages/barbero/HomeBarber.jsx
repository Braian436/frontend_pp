import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../auth/useAuth.js";
import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import { claveFecha, normalizarTurno, obtenerResumenBarbero } from "./barberoApi.js";
import ListCardStats from "./ListCardStats";
import ListaTurnos from "./ListaTurnos.jsx";
import styles from "./HomeBarber.module.css";

const SIN_EMPLEADO = "Tu usuario no tiene un barbero vinculado. Pedile al administrador que asocie tu cuenta.";

export default function HomeBarber() {
    const { idEmpleado, nombre, usuario } = useAuth();
    const [params] = useSearchParams();

    const empleadoUrl = params.get("empleado");
    const empleado = empleadoUrl || idEmpleado || "";
    const fecha = claveFecha(new Date());

    const [resumen, setResumen] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!empleado) return undefined;
        const controller = new AbortController();

        const cargar = async () => {
            setCargando(true);
            setError("");
            try {
                const datos = await obtenerResumenBarbero({
                    empleado,
                    fecha,
                    signal: controller.signal,
                });
                if (!controller.signal.aborted) setResumen(datos);
            } catch (fallo) {
                if (fallo.name !== "AbortError") setError(fallo.message);
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };

        void cargar();
        return () => controller.abort();
    }, [empleado, fecha]);

    const turnos = useMemo(
        () => (resumen?.proximos_turnos ?? []).map(normalizarTurno),
        [resumen]
    );

    const nombreBarbero = nombre || usuario || "Barbero";
    const errorMostrado = empleado ? error : SIN_EMPLEADO;
    const cargandoMostrado = Boolean(empleado) && cargando;

    return (
        <div className={styles.contenedorPrincipal}>
            <CardHomeBienvenida
                titulo="PANEL DEL BARBERO"
                descripcion={`Bienvenido, ${nombreBarbero}`}
                detalle="Estadísticas recurrentes"
            />
            <ListCardStats
                resumen={resumen}
                cargando={cargandoMostrado}
                error={errorMostrado}
            />
            <ListaTurnos
                turnos={turnos}
                cargando={cargandoMostrado}
                error={errorMostrado}
            />
        </div>
    );
}
