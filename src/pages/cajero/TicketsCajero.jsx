import { useState } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";
import AnularTicketModal from "../../components/anularTicketModal/AnularTicketModal.jsx";
import CobroTicketModal from "../../components/cobroTicketModal/CobroTicketModal.jsx";
import NuevoTicketModal from "../../components/nuevoTicketModal/NuevoTicketModal.jsx";
import TicketCajero from "../../components/ticketCajero/TicketCajero.jsx";
import { useCajaApi } from "./cajaApi.js";
import { dinero } from "./cajaData.js";
import styles from "./TicketsCajero.module.css";

export default function TicketsCajero() {
    const {
        estado,
        tickets,
        resumen,
        cobrarTicket,
        crearTicket,
        anularTicket,
        cancelarTicket,
        error,
        procesando,
        usuarioSesion,
        limpiarError,
    } = useCajaApi();
    const [filtro, setFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [ticketACobrar, setTicketACobrar] = useState(null);
    const [nuevoTicket, setNuevoTicket] = useState(false);
    const [ticketAccion, setTicketAccion] = useState(null);
    const cerrada = estado === "cerrada";
    const texto = busqueda.trim().toLowerCase();

    const esAnulada = (ticket) =>
        ticket.estado === "anulada" || ticket.estado === "cancelada";

    const filtrados = [...tickets]
        .sort((a, b) => b.hora.localeCompare(a.hora))
        .filter((ticket) => {
            const coincideFiltro =
                filtro === "todos" ||
                (filtro === "anulada" ? esAnulada(ticket) : ticket.estado === filtro);
            const coincideBusqueda =
                !texto ||
                ticket.cliente.toLowerCase().includes(texto) ||
                ticket.barbero.toLowerCase().includes(texto);

            return coincideFiltro && coincideBusqueda;
        });

    const contar = (valor) => {
        if (valor === "todos") return tickets.length;
        if (valor === "anulada") return tickets.filter(esAnulada).length;
        return tickets.filter((ticket) => ticket.estado === valor).length;
    };

    const confirmarAccion = async (datos) => {
        if (!ticketAccion) return;
        const ok =
            ticketAccion.modo === "anular"
                ? await anularTicket(ticketAccion.ticket.id, datos)
                : await cancelarTicket(ticketAccion.ticket.id, datos);
        if (ok) {
            limpiarError();
            setTicketAccion(null);
        }
    };

    return (
        <section className={`min-vh-100 ${styles.pagina}`}>
            <div className="container-fluid px-3 px-lg-5 py-4">
                <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
                    <div>
                        <span className={styles.etiqueta}>Panel de caja</span>
                        <h1 className={styles.titulo}>Tickets</h1>
                        <p className={styles.descripcion}>
                            Cobrá los servicios pendientes y revisá el historial del
                            turno.
                        </p>
                    </div>
                    <span
                        className={`${styles.estado} ${cerrada ? styles.cerrada : ""}`}
                    >
                        <span /> {cerrada ? "Caja cerrada" : "Caja abierta"}
                    </span>
                </div>

                <div className={styles.acciones}>
                    <button
                        type="button"
                        className={styles.nuevo}
                        onClick={() => setNuevoTicket(true)}
                    >
                        <LuPlus aria-hidden="true" /> Nuevo ticket
                    </button>
                </div>

                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                <div className={styles.filtros}>
                    <label className={styles.buscador}>
                        <LuSearch aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Buscar por cliente o barbero"
                            value={busqueda}
                            onChange={(evento) => setBusqueda(evento.target.value)}
                        />
                    </label>

                    <div className="d-flex flex-wrap gap-2">
                        {[
                            ["todos", "Todos"],
                            ["pendiente", "Pendientes"],
                            ["cobrado", "Cobrados"],
                            ["anulada", "Anuladas"],
                        ].map(([valor, etiqueta]) => (
                            <button
                                type="button"
                                key={valor}
                                className={`${styles.filtro} ${
                                    filtro === valor ? styles.activo : ""
                                }`}
                                onClick={() => setFiltro(valor)}
                            >
                                {etiqueta} <span>{contar(valor)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelCabecera}>
                        <h2>
                            {filtro === "todos"
                                ? "Todos los tickets"
                                : filtro === "pendiente"
                                  ? "Tickets pendientes"
                                  : filtro === "cobrado"
                                    ? "Tickets cobrados"
                                    : "Tickets anulados o cancelados"}
                        </h2>
                        <span>{filtrados.length} resultados</span>
                    </div>

                    {filtrados.length === 0 ? (
                        <p className={styles.vacio}>
                            No encontramos tickets con esos filtros.
                        </p>
                    ) : (
                        <ul className="list-unstyled mb-0">
                            {filtrados.map((ticket) => (
                                <TicketCajero
                                    key={ticket.id}
                                    ticket={ticket}
                                    onCobrar={setTicketACobrar}
                                    onAnular={(seleccionado) =>
                                        setTicketAccion({
                                            ticket: seleccionado,
                                            modo: "anular",
                                        })
                                    }
                                    onCancelar={(seleccionado) =>
                                        setTicketAccion({
                                            ticket: seleccionado,
                                            modo: "cancelar",
                                        })
                                    }
                                    deshabilitado={cerrada}
                                />
                            ))}
                        </ul>
                    )}

                    <div className={styles.pie}>
                        <p>
                            Pendiente <strong>{dinero(resumen.totalPendiente)}</strong>
                        </p>
                        <p>
                            Cobrado en el turno{" "}
                            <strong>{dinero(resumen.totalCobrado)}</strong>
                        </p>
                        {resumen.totalAnulado > 0 && (
                            <p>
                                Anulado{" "}
                                <strong>{dinero(resumen.totalAnulado)}</strong>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {ticketACobrar && (
                <CobroTicketModal
                    ticket={ticketACobrar}
                    onCerrar={() => setTicketACobrar(null)}
                    onConfirmar={async (datos) => {
                        const ok = await cobrarTicket(ticketACobrar.id, datos);
                        if (ok) {
                            limpiarError();
                            setTicketACobrar(null);
                        }
                    }}
                    procesando={procesando}
                    error={error}
                />
            )}
            {nuevoTicket && (
                <NuevoTicketModal
                    onCerrar={() => setNuevoTicket(false)}
                    onConfirmar={async (datos) => {
                        const ok = await crearTicket(datos);
                        if (ok) {
                            limpiarError();
                            setNuevoTicket(false);
                        }
                    }}
                    procesando={procesando}
                    error={error}
                />
            )}
            {ticketAccion && (
                <AnularTicketModal
                    ticket={ticketAccion.ticket}
                    modo={ticketAccion.modo}
                    onCerrar={() => {
                        setTicketAccion(null);
                        limpiarError();
                    }}
                    onConfirmar={confirmarAccion}
                    procesando={procesando}
                    error={error}
                    usuarioSesion={usuarioSesion}
                />
            )}
        </section>
    );
}
