import { useState } from "react";
import { LuBan, LuCircleX, LuEye, LuEyeOff } from "react-icons/lu";

import CajaModal from "../cajaModal/CajaModal.jsx";
import styles from "./AnularTicketModal.module.css";

const dinero = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

export default function AnularTicketModal({
    ticket,
    modo = "anular",
    onCerrar,
    onConfirmar,
    procesando = false,
    error = "",
    usuarioSesion = "",
}) {
    const anular = modo === "anular";
    const [motivo, setMotivo] = useState("");
    const [usuario, setUsuario] = useState(usuarioSesion || "");
    const [contrasena, setContrasena] = useState("");
    const [verContrasena, setVerContrasena] = useState(false);
    const [errorLocal, setErrorLocal] = useState("");

    const confirmar = () => {
        if (motivo.trim().length < 5) {
            setErrorLocal("Ingresá un motivo de al menos 5 caracteres.");
            return;
        }
        if (anular && !usuario.trim()) {
            setErrorLocal("Ingresá el usuario del cajero que abrió la caja.");
            return;
        }
        if (anular && !contrasena) {
            setErrorLocal("Ingresá la contraseña del cajero.");
            return;
        }

        setErrorLocal("");
        onConfirmar(
            anular
                ? {
                      motivo: motivo.trim(),
                      usuario: usuario.trim(),
                      contrasena,
                  }
                : { motivo: motivo.trim() }
        );
    };

    return (
        <CajaModal
            titulo={anular ? "Anular venta" : "Cancelar ticket"}
            descripcion={
                anular
                    ? "La venta no se elimina: se anula y queda registrada."
                    : "El ticket todavía no se cobró; se cancela y repone el stock."
            }
            icono={anular ? LuBan : LuCircleX}
            onCerrar={onCerrar}
            onConfirmar={confirmar}
            textoConfirmar={anular ? "Anular venta" : "Cancelar ticket"}
            procesando={procesando}
            error={errorLocal || error}
            peligro
        >
            <div className={styles.resumen}>
                <span>Ticket #{ticket.id}</span>
                <strong>{dinero(ticket.monto)}</strong>
                <small>
                    {ticket.cliente} · {ticket.servicios}
                </small>
            </div>

            <label className={styles.campo} htmlFor="motivoAnulacion">
                <span className={styles.etiqueta}>Motivo *</span>
                <textarea
                    id="motivoAnulacion"
                    className={styles.textarea}
                    value={motivo}
                    maxLength={200}
                    onChange={(evento) => {
                        setMotivo(evento.target.value);
                        setErrorLocal("");
                    }}
                    placeholder={
                        anular
                            ? "Ej. cobro duplicado, error de monto..."
                            : "Ej. ticket duplicado, cliente se retiró..."
                    }
                />
            </label>

            {anular && (
                <>
                    <label className={styles.campo} htmlFor="usuarioAnulacion">
                        <span className={styles.etiqueta}>
                            Usuario del cajero *
                        </span>
                        <input
                            id="usuarioAnulacion"
                            className={styles.input}
                            type="text"
                            autoComplete="username"
                            value={usuario}
                            onChange={(evento) => {
                                setUsuario(evento.target.value);
                                setErrorLocal("");
                            }}
                        />
                    </label>

                    <label
                        className={styles.campo}
                        htmlFor="contrasenaAnulacion"
                    >
                        <span className={styles.etiqueta}>Contraseña *</span>
                        <div className={styles.clave}>
                            <input
                                id="contrasenaAnulacion"
                                className={styles.input}
                                type={verContrasena ? "text" : "password"}
                                autoComplete="current-password"
                                value={contrasena}
                                onChange={(evento) => {
                                    setContrasena(evento.target.value);
                                    setErrorLocal("");
                                }}
                            />
                            <button
                                type="button"
                                className={styles.ojo}
                                onClick={() => setVerContrasena((valor) => !valor)}
                                aria-label={
                                    verContrasena
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                            >
                                {verContrasena ? (
                                    <LuEyeOff aria-hidden="true" />
                                ) : (
                                    <LuEye aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </label>

                    <p className={styles.ayuda}>
                        Solo el cajero que abrió la caja puede anular. Se
                        registra el movimiento inverso en la caja y se repone el
                        stock.
                    </p>
                </>
            )}
        </CajaModal>
    );
}
