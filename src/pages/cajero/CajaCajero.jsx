import { useState } from "react";
import {
    LuArrowDownToLine,
    LuArrowUpFromLine,
    LuBanknote,
    LuLock,
    LuWallet,
} from "react-icons/lu";
import MovimientoCajaModal from "../../components/movimientoCajaModal/MovimientoCajaModal.jsx";
import CierreCajaModal from "../../components/cierreCajaModal/CierreCajaModal.jsx";
import IndicadoresCaja from "../../components/indicadoresCaja/IndicadoresCaja.jsx";
import TablaMovimientosCaja from "../../components/tablaMovimientosCaja/TablaMovimientosCaja.jsx";
import { useCajaApi } from "./cajaApi.js";
import { dinero } from "./cajaData.js";
import styles from "./CajaCajero.module.css";

export default function CajaCajero() {
    const {
        caja,
        estado,
        movimientos,
        resumen,
        registrarMovimiento,
        cerrarCaja,
        abrirCaja,
        error,
    } = useCajaApi();
    const [modal, setModal] = useState(null);
    const cerrada = estado === "cerrada";

    const indicadores = [
        {
            titulo: "Apertura",
            valor: dinero(resumen.apertura),
            detalle: `A las ${caja?.fechaInicio ?? "10:00"} hs`,
            icono: LuBanknote,
        },
        {
            titulo: "Ingresos",
            valor: dinero(resumen.ingresos),
            detalle: "Efectivo, tarjeta y transferencia",
            icono: LuArrowUpFromLine,
            color: "verde",
        },
        {
            titulo: "Egresos",
            valor: dinero(resumen.egresos),
            detalle: "Salidas de caja",
            icono: LuArrowDownToLine,
            color: resumen.egresos > 0 ? "rojo" : "",
        },
        {
            titulo: "Saldo en cajón",
            valor: dinero(resumen.efectivoEnCajon),
            detalle: "Efectivo disponible",
            icono: LuWallet,
            color: "verde",
        },
    ];

    const registrar = (datos) => {
        if (modal === "apertura") {
            abrirCaja(datos.monto);
        } else {
            registrarMovimiento({
                tipo: modal,
                monto: datos.monto,
                concepto: datos.concepto,
            });
        }
        setModal(null);
    };

    const confirmarCierre = (datos) => {
        cerrarCaja(datos);
        setModal(null);
    };

    return (
        <section className={`min-vh-100 ${styles.pagina}`}>
            <div className="container-fluid px-3 px-lg-5 py-4">
                <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
                    <div>
                        <span className={styles.etiqueta}>Panel de caja</span>
                        <h1 className={styles.titulo}>Caja</h1>
                        <p className={styles.descripcion}>
                            Controlá los ingresos, egresos y el saldo del turno.
                        </p>
                    </div>
                    <span
                        className={`${styles.estado} ${cerrada ? styles.cerrada : ""}`}
                    >
                        <span /> {cerrada ? "Caja cerrada" : "Caja abierta"}
                    </span>
                </div>

                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                <IndicadoresCaja indicadores={indicadores} />

                <div className={styles.acciones}>
                    {cerrada ? (
                        <button
                            type="button"
                            className={styles.boton}
                            onClick={() => setModal("apertura")}
                        >
                            <LuWallet aria-hidden="true" /> Abrir caja
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className={styles.boton}
                                onClick={() => setModal("ingreso")}
                            >
                                <LuArrowUpFromLine aria-hidden="true" /> Nuevo ingreso
                            </button>
                            <button
                                type="button"
                                className={styles.boton}
                                onClick={() => setModal("egreso")}
                            >
                                <LuArrowDownToLine aria-hidden="true" /> Nuevo egreso
                            </button>
                            <button
                                type="button"
                                className={styles.cerrar}
                                onClick={() => setModal("cierre")}
                            >
                                <LuLock aria-hidden="true" /> Cerrar caja
                            </button>
                        </>
                    )}
                </div>

                <TablaMovimientosCaja movimientos={movimientos} />
            </div>

            {["ingreso", "egreso", "apertura"].includes(modal) && (
                <MovimientoCajaModal
                    tipo={modal}
                    onCerrar={() => setModal(null)}
                    onRegistrar={registrar}
                    error={error}
                />
            )}
            {modal === "cierre" && (
                <CierreCajaModal
                    resumen={resumen}
                    onCerrar={() => setModal(null)}
                    onConfirmar={confirmarCierre}
                    error={error}
                />
            )}
        </section>
    );
}
