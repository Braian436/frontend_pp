import { useState } from "react";
import {
    LuArrowDownToLine,
    LuArrowUpFromLine,
    LuEye,
    LuEyeOff,
    LuWallet,
} from "react-icons/lu";
import CajaModal from "../cajaModal/CajaModal.jsx";
import SelectorMetodo from "../selectorMetodo/SelectorMetodo.jsx";
import { METODOS } from "../../pages/cajero/cajaData.js";
import styles from "./MovimientoCajaModal.module.css";

const CONFIG = {
    apertura: {
        titulo: "Abrir caja",
        descripcion: "Ingresá el saldo inicial con el que arranca el turno.",
        texto: "Abrir caja",
        concepto: "Apertura de caja",
        icono: LuWallet,
        etiquetaMonto: "Saldo inicial",
    },
    ingreso: {
        titulo: "Nuevo ingreso",
        descripcion: "Registrá el monto a cobrar, el medio de pago y el vuelto.",
        texto: "Registrar ingreso",
        concepto: "Ingreso manual",
        icono: LuArrowUpFromLine,
        etiquetaMonto: "Monto a cobrar",
    },
    egreso: {
        titulo: "Nuevo egreso",
        descripcion: "Registrá una salida y elegí si es en efectivo o por transferencia.",
        texto: "Registrar egreso",
        concepto: "Egreso manual",
        icono: LuArrowDownToLine,
        etiquetaMonto: "Monto del egreso",
    },
};

const dinero = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

export default function MovimientoCajaModal({
    tipo,
    onCerrar,
    onRegistrar,
    procesando = false,
    error = "",
    usuarioSesion = "",
}) {
    const config = CONFIG[tipo] ?? CONFIG.ingreso;
    const esIngreso = tipo === "ingreso";
    const esEgreso = tipo === "egreso";
    const esApertura = tipo === "apertura";
    const esMovimiento = esIngreso || esEgreso;
    const [monto, setMonto] = useState("");
    const [concepto, setConcepto] = useState(config.concepto);
    const [metodo, setMetodo] = useState("efectivo");
    const [montoRecibido, setMontoRecibido] = useState("");
    const [usuario, setUsuario] = useState(usuarioSesion || "");
    const [contrasena, setContrasena] = useState("");
    const [verContrasena, setVerContrasena] = useState(false);
    const [errorLocal, setErrorLocal] = useState("");
    const esEfectivo = esIngreso && metodo === "efectivo";
    const total = Number(monto) || 0;
    const vuelto = (Number(montoRecibido) || 0) - total;

    const confirmar = () => {
        if (!total || total <= 0) {
            setErrorLocal("Ingresá un monto mayor a cero.");
            return;
        }

        if (
            esEfectivo &&
            (montoRecibido === "" || Number(montoRecibido) < total)
        ) {
            setErrorLocal(
                "El monto recibido debe ser igual o mayor al monto a cobrar."
            );
            return;
        }

        if (esApertura) {
            if (!usuario.trim()) {
                setErrorLocal("Ingresá tu usuario.");
                return;
            }
            if (!contrasena) {
                setErrorLocal("Ingresá tu contraseña.");
                return;
            }
        }

        setErrorLocal("");
        onRegistrar({
            monto: total,
            concepto,
            metodo: esMovimiento ? metodo : "efectivo",
            montoRecibido: esEfectivo ? Number(montoRecibido) : null,
            usuario: esApertura ? usuario.trim() : undefined,
            contrasena: esApertura ? contrasena : undefined,
        });
    };

    return (
        <CajaModal
            titulo={config.titulo}
            descripcion={config.descripcion}
            icono={config.icono}
            onCerrar={onCerrar}
            onConfirmar={confirmar}
            textoConfirmar={config.texto}
            procesando={procesando}
            error={errorLocal || error}
            peligro={tipo === "egreso"}
        >
            <label className={styles.campo} htmlFor="caja-monto">
                <span className={styles.etiqueta}>{config.etiquetaMonto}</span>
                <div className={styles.monto}>
                    <span aria-hidden="true">$</span>
                    <input
                        id="caja-monto"
                        className={styles.input}
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0"
                        value={monto}
                        onChange={(evento) => setMonto(evento.target.value)}
                        autoFocus
                    />
                </div>
            </label>

            {esApertura && (
                <>
                    <label className={styles.campo} htmlFor="caja-usuario">
                        <span className={styles.etiqueta}>Usuario</span>
                        <input
                            id="caja-usuario"
                            className={styles.inputSimple}
                            type="text"
                            autoComplete="username"
                            value={usuario}
                            onChange={(evento) => {
                                setUsuario(evento.target.value);
                                setErrorLocal("");
                            }}
                        />
                    </label>

                    <label className={styles.campo} htmlFor="caja-contrasena">
                        <span className={styles.etiqueta}>Contraseña</span>
                        <div className={styles.clave}>
                            <input
                                id="caja-contrasena"
                                className={styles.inputSimple}
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
                                onClick={() =>
                                    setVerContrasena((valor) => !valor)
                                }
                                aria-label={
                                    verContrasena
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                            >
                                {verContrasena ? <LuEyeOff /> : <LuEye />}
                            </button>
                        </div>
                    </label>
                </>
            )}

            {esMovimiento && (
                <SelectorMetodo
                    valor={metodo}
                    onChange={(nuevo) => {
                        setMetodo(nuevo);
                        setErrorLocal("");
                    }}
                />
            )}

            {esEfectivo && (
                <>
                    <label className={styles.campo} htmlFor="caja-recibido">
                        <span className={styles.etiqueta}>Monto recibido</span>
                        <input
                            id="caja-recibido"
                            className={styles.inputSimple}
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            placeholder="0"
                            value={montoRecibido}
                            onChange={(evento) =>
                                setMontoRecibido(evento.target.value)
                            }
                        />
                    </label>

                    {montoRecibido !== "" && (
                        <p
                            className={`${styles.vuelto} ${
                                vuelto < 0
                                    ? styles.vueltoError
                                    : styles.vueltoOk
                            }`}
                        >
                            <span>{vuelto < 0 ? "Falta" : "Vuelto"}</span>
                            <strong>{dinero(Math.abs(vuelto))}</strong>
                        </p>
                    )}
                </>
            )}

            {esIngreso && !esEfectivo && (
                <p className={styles.nota}>
                    Se cobra el total exacto con {METODOS[metodo].toLowerCase()}.
                </p>
            )}

            {esEgreso && metodo !== "efectivo" && (
                <p className={styles.nota}>
                    Se descuenta por {METODOS[metodo].toLowerCase()}; no afecta el
                    efectivo del cajón.
                </p>
            )}

            <label className={styles.campo} htmlFor="caja-concepto">
                <span className={styles.etiqueta}>Concepto</span>
                <input
                    id="caja-concepto"
                    className={styles.inputSimple}
                    type="text"
                    maxLength={120}
                    value={concepto}
                    onChange={(evento) => setConcepto(evento.target.value)}
                />
            </label>

            <p className={styles.ayuda}>
                El movimiento queda registrado en la caja del turno.
            </p>
        </CajaModal>
    );
}
