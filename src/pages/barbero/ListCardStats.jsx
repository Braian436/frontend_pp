import { LuCalendarPlus, LuCircleDollarSign, LuReceipt, LuUsers } from "react-icons/lu";

import CardEstadisticasBarbero from "../../components/cardEstadisticasBarbero/CardEstadisticasBarbero.jsx";

const moneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
});

const numero = new Intl.NumberFormat("es-AR");

const formatearMonto = (valor) => moneda.format(Number(valor) || 0);
const formatearCantidad = (valor) => numero.format(Number(valor) || 0);

export default function ListCardStats({ resumen, cargando = false, error = "" }) {
    const valor = (formatear, campo) => {
        if (cargando) return "...";
        return formatear(resumen?.[campo]);
    };

    const pendientes = Number(resumen?.turnos_hoy_pendientes) || 0;

    const indicadores = [
        {
            titulo: "Servicios realizados por semana",
            valor: valor(formatearCantidad, "servicios_semana"),
            detalle: "Últimos 7 días",
            icono: LuCalendarPlus,
            color: "verde",
        },
        {
            titulo: "Total semanal acumulado",
            valor: valor(formatearMonto, "total_semanal"),
            detalle: "Ventas de los últimos 7 días",
            icono: LuUsers,
            color: "verde",
        },
        {
            titulo: "Comisiones del día",
            valor: valor(formatearMonto, "comisiones_dia"),
            detalle: "Calculadas sobre las ventas de hoy",
            icono: LuCircleDollarSign,
            color: "ambar",
        },
        {
            titulo: "Turnos de hoy",
            valor: valor(formatearCantidad, "turnos_hoy"),
            detalle: cargando
                ? "Cargando..."
                : `${formatearCantidad(pendientes)} ${pendientes === 1 ? "pendiente" : "pendientes"}`,
            icono: LuReceipt,
            color: "ambar",
        },
    ];

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 mb-4">
            {error && (
                <div className="col-12">
                    <p className="text-danger mb-0" role="alert">{error}</p>
                </div>
            )}
            {indicadores.map(({ titulo, valor: dato, detalle, icono: Icono, color }, indice) => (
                <CardEstadisticasBarbero
                    key={`${titulo}-${indice}`}
                    titulo={titulo}
                    valor={dato}
                    detalle={detalle}
                    color={color}
                    Icono={Icono}
                />
            ))}
        </div>
    );
}
