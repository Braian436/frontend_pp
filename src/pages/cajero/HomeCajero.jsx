import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LuBanknote,
    LuHandCoins,
    LuTicket,
    LuWallet,
} from "react-icons/lu";
import AccesosCajero from "../../components/accesosCajero/AccesosCajero.jsx";
import IndicadoresCaja from "../../components/indicadoresCaja/IndicadoresCaja.jsx";
import MovimientoCajaModal from "../../components/movimientoCajaModal/MovimientoCajaModal.jsx";
import CierreCajaModal from "../../components/cierreCajaModal/CierreCajaModal.jsx";
import CobroTicketModal from "../../components/cobroTicketModal/CobroTicketModal.jsx";
import TicketCajero from "../../components/ticketCajero/TicketCajero.jsx";
import { useCajaApi } from "./cajaApi.js";
import { dinero, fechaLarga } from "./cajaData.js";
import styles from "./HomeCajero.module.css";
import fondoCajero from "../../assets/facha4.png";

const fondoHero = {
    backgroundImage: `linear-gradient(90deg, rgba(12, 12, 12, 0.9), rgba(12, 12, 12, 0.32)), url("${fondoCajero}")`,
};

export default function HomeCajero() {
    const {
        caja,
        estado,
        resumen,
        cobrarTicket,
        registrarMovimiento,
        cerrarCaja,
        abrirCaja,
        error,
    } = useCajaApi();
    const navigate = useNavigate();
    const [modal, setModal] = useState(null);
    const [ticketACobrar, setTicketACobrar] = useState(null);
    const cerrada = estado === "cerrada";
    const pendientes = resumen.pendientes;

    const textoPendientes =
        pendientes.length === 0
            ? "no quedan tickets sin cobrar"
            : pendientes.length === 1
              ? "queda 1 ticket sin cobrar"
              : `quedan ${pendientes.length} tickets sin cobrar`;

    const indicadores = [
        {
            titulo: "Caja del día",
            valor: dinero(resumen.cajaDelDia),
            detalle: "Apertura + ingresos - egresos",
            icono: LuWallet,
            color: "verde",
            barra: true,
        },
        {
            titulo: "Sin cobrar",
            valor: pendientes.length,
            detalle: `${dinero(resumen.totalPendiente)} pendientes`,
            icono: LuTicket,
        },
        {
            titulo: "Efectivo en cajón",
            valor: dinero(resumen.efectivoEnCajon),
            detalle: `Incluye apertura de ${dinero(resumen.apertura)}`,
            icono: LuBanknote,
        },
        {
            titulo: "Propinas",
            valor: dinero(resumen.propinas),
            detalle: "Se reparten al cierre",
            icono: LuHandCoins,
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
        <div className={`min-vh-100 ${styles.dashboard}`}>
            <div className="container-fluid px-3 px-lg-5">
                <section
                    className={`d-flex align-items-center ${styles.hero}`}
                    style={fondoHero}
                >
                    <div className={styles.heroTexto}>
                        <p className={styles.eyebrow}>Panel de caja</p>
                        <h1>
                            Bienvenido,
                            <br />
                            cajero
                        </h1>
                        <p>
                            {fechaLarga()} · Turno tarde.{" "}
                            {cerrada ? (
                                "La caja está cerrada. Abrila para volver a operar."
                            ) : (
                                <>
                                    Abriste caja a las{" "}
                                    <strong>{caja?.fechaInicio ?? "10:00"} hs</strong>{" "}
                                    y {textoPendientes}.
                                </>
                            )}
                        </p>
                    </div>
                    <span
                        className={`${styles.estado} ${cerrada ? styles.cerrada : ""}`}
                    >
                        <span /> {cerrada ? "Caja cerrada" : "Caja abierta"}
                    </span>
                </section>
            </div>

            <section
                className="container-fluid px-3 px-lg-5 py-4"
                aria-label="Resumen de la caja"
            >
                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                <IndicadoresCaja indicadores={indicadores} />

                <AccesosCajero
                    cerrada={cerrada}
                    onTickets={() => navigate("/cajero/tickets")}
                    onIngreso={() => setModal("ingreso")}
                    onEgreso={() => setModal("egreso")}
                    onCaja={() => setModal(cerrada ? "apertura" : "cierre")}
                />

                <section className="mt-4">
                    <div className={styles.encabezadoSeccion}>
                        <h2>Tickets por cobrar</h2>
                        <span>{pendientes.length} esperando en mostrador</span>
                    </div>

                    <div className={styles.listaTickets}>
                        {pendientes.length === 0 ? (
                            <p className={styles.vacio}>No hay tickets pendientes.</p>
                        ) : (
                            <ul className="list-unstyled mb-0">
                                {pendientes.map((ticket) => (
                                    <TicketCajero
                                        key={ticket.id}
                                        ticket={ticket}
                                        onCobrar={setTicketACobrar}
                                        deshabilitado={cerrada}
                                    />
                                ))}
                            </ul>
                        )}

                        <div className={styles.pie}>
                            <p>
                                Total pendiente{" "}
                                <strong>{dinero(resumen.totalPendiente)}</strong>
                            </p>
                            <Link to="/cajero/tickets" className={styles.verTodos}>
                                Ver todos los tickets
                            </Link>
                        </div>
                    </div>
                </section>
            </section>

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
            {ticketACobrar && (
                <CobroTicketModal
                    ticket={ticketACobrar}
                    onCerrar={() => setTicketACobrar(null)}
                    onConfirmar={(datos) => {
                        cobrarTicket(ticketACobrar.id, datos);
                        setTicketACobrar(null);
                    }}
                    error={error}
                />
            )}
        </div>
    );
}
