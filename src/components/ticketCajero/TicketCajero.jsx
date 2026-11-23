import { METODOS } from "../../pages/cajero/cajaData.js";
import styles from "./TicketCajero.module.css";

const dinero = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

export default function TicketCajero({ ticket, onCobrar, deshabilitado = false }) {
    const pendiente = ticket.estado === "pendiente";

    return (
        <li className={styles.ticket}>
            <span className={styles.hora}>{ticket.hora}</span>

            <div className={styles.datos}>
                <strong>{ticket.cliente}</strong>
                <span>
                    {ticket.servicios} · {ticket.barbero}
                </span>
            </div>

            <span
                className={`${styles.badge} ${
                    pendiente ? styles.pendiente : styles.cobrado
                }`}
            >
                {ticket.estado}
                {!pendiente && ticket.metodo
                    ? ` · ${METODOS[ticket.metodo]}`
                    : ""}
            </span>

            <span className={styles.monto}>{dinero(ticket.monto)}</span>

            {pendiente && onCobrar ? (
                <button
                    type="button"
                    className={styles.cobrar}
                    onClick={() => onCobrar(ticket)}
                    disabled={deshabilitado}
                >
                    Cobrar
                </button>
            ) : (
                <span className={styles.listo} aria-hidden="true" />
            )}
        </li>
    );
}
