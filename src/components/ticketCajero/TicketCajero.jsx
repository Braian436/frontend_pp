import { METODOS } from "../../pages/cajero/cajaData.js";
import styles from "./TicketCajero.module.css";

const dinero = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

const BADGES = {
    pendiente: { clase: "pendiente", texto: "Pendiente" },
    cobrado: { clase: "cobrado", texto: "Cobrado" },
    anulada: { clase: "anulada", texto: "Anulada" },
    cancelada: { clase: "cancelada", texto: "Cancelada" },
};

export default function TicketCajero({
    ticket,
    onCobrar,
    onAnular,
    onCancelar,
    deshabilitado = false,
}) {
    const pendiente = ticket.estado === "pendiente";
    const cobrado = ticket.estado === "cobrado";
    const anulada = ticket.estado === "anulada";
    const cancelada = ticket.estado === "cancelada";
    const badge = BADGES[ticket.estado] ?? BADGES.pendiente;
    const enCaja = !anulada && !cancelada;

    return (
        <li className={styles.ticket}>
            <span className={styles.hora}>{ticket.hora}</span>

            <div className={styles.datos}>
                <strong>{ticket.cliente}</strong>
                <span>
                    {ticket.servicios} · {ticket.barbero}
                </span>
            </div>

            <span className={`${styles.badge} ${styles[badge.clase]}`}>
                {badge.texto}
                {cobrado && ticket.metodo
                    ? ` · ${METODOS[ticket.metodo]}`
                    : ""}
            </span>

            <span className={styles.monto}>{dinero(ticket.monto)}</span>

            {enCaja && (pendiente || cobrado) ? (
                <div className={styles.acciones}>
                    {pendiente && onCobrar && (
                        <button
                            type="button"
                            className={styles.cobrar}
                            onClick={() => onCobrar(ticket)}
                            disabled={deshabilitado}
                        >
                            Cobrar
                        </button>
                    )}
                    {pendiente && onCancelar && (
                        <button
                            type="button"
                            className={styles.cancelar}
                            onClick={() => onCancelar(ticket)}
                            disabled={deshabilitado}
                        >
                            Cancelar
                        </button>
                    )}
                    {cobrado && onAnular && (
                        <button
                            type="button"
                            className={styles.anular}
                            onClick={() => onAnular(ticket)}
                            disabled={deshabilitado}
                        >
                            Anular
                        </button>
                    )}
                </div>
            ) : (
                <span className={styles.listo} aria-hidden="true" />
            )}

            {(anulada || cancelada) && ticket.motivoAnulacion && (
                <p className={styles.motivo}>
                    Motivo: {ticket.motivoAnulacion}
                    {ticket.anuladaPor ? ` · ${ticket.anuladaPor}` : ""}
                </p>
            )}
        </li>
    );
}
