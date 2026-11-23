import { useState } from "react";
import { LuTicket } from "react-icons/lu";
import CajaModal from "../cajaModal/CajaModal.jsx";
import SelectorMetodo from "../selectorMetodo/SelectorMetodo.jsx";
import { METODOS } from "../../pages/cajero/cajaData.js";
import styles from "./CobroTicketModal.module.css";

const dinero = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

export default function CobroTicketModal({
    ticket,
    onCerrar,
    onConfirmar,
    procesando = false,
    error = "",
}) {
    const [metodo, setMetodo] = useState("efectivo");
    const [montoRecibido, setMontoRecibido] = useState(String(ticket.monto));
    const [errorLocal, setErrorLocal] = useState("");
    const esEfectivo = metodo === "efectivo";
    const vuelto = (Number(montoRecibido) || 0) - ticket.monto;

    const confirmar = () => {
        if (esEfectivo && Number(montoRecibido) < ticket.monto) {
            setErrorLocal("El monto recibido debe ser igual o mayor al total.");
            return;
        }

        setErrorLocal("");
        onConfirmar({
            metodo,
            montoRecibido: esEfectivo ? Number(montoRecibido) : null,
        });
    };

    return (
        <CajaModal
            titulo="Cobrar ticket"
            descripcion="Elegí el medio de pago y calculá el vuelto del cliente."
            icono={LuTicket}
            onCerrar={onCerrar}
            onConfirmar={confirmar}
            textoConfirmar="Cobrar ticket"
            procesando={procesando}
            error={errorLocal || error}
        >
            <div className={styles.resumen}>
                <div className={styles.cliente}>
                    <strong>{ticket.cliente}</strong>
                    <span>
                        {ticket.servicios} · {ticket.barbero}
                    </span>
                </div>
                <div className={styles.total}>
                    <span>Total a pagar</span>
                    <strong>{dinero(ticket.monto)}</strong>
                </div>
            </div>

            <SelectorMetodo valor={metodo} onChange={setMetodo} />

            {esEfectivo ? (
                <>
                    <label className={styles.campo} htmlFor="cobro-recibido">
                        <span className={styles.etiqueta}>Monto recibido</span>
                        <input
                            id="cobro-recibido"
                            className={styles.input}
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={montoRecibido}
                            onChange={(evento) =>
                                setMontoRecibido(evento.target.value)
                            }
                        />
                    </label>

                    <p
                        className={`${styles.vuelto} ${
                            vuelto < 0 ? styles.vueltoError : styles.vueltoOk
                        }`}
                    >
                        <span>{vuelto < 0 ? "Falta" : "Vuelto"}</span>
                        <strong>{dinero(Math.abs(vuelto))}</strong>
                    </p>
                </>
            ) : (
                <p className={styles.nota}>
                    Se cobra el total exacto con {METODOS[metodo].toLowerCase()}.
                </p>
            )}
        </CajaModal>
    );
}
