import { useState } from "react";
import { LuEye, LuEyeOff, LuLock } from "react-icons/lu";
import CajaModal from "../cajaModal/CajaModal.jsx";
import styles from "./CierreCajaModal.module.css";

const dinero = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

export default function CierreCajaModal({
    resumen,
    onCerrar,
    onConfirmar,
    procesando = false,
    error = "",
    usuarioSesion = "",
}) {
    const [saldoReal, setSaldoReal] = useState(() =>
        String(resumen.saldoEsperado ?? 0)
    );
    const [observacion, setObservacion] = useState("");
    const [usuario, setUsuario] = useState(usuarioSesion || "");
    const [contrasena, setContrasena] = useState("");
    const [verContrasena, setVerContrasena] = useState(false);
    const [errorLocal, setErrorLocal] = useState("");

    const diferencia = (Number(saldoReal) || 0) - resumen.saldoEsperado;

    const confirmar = () => {
        if (saldoReal === "" || Number.isNaN(Number(saldoReal))) {
            setErrorLocal("Ingresá el saldo real contado en el cajón.");
            return;
        }

        if (!usuario.trim()) {
            setErrorLocal("Ingresá tu usuario.");
            return;
        }
        if (!contrasena) {
            setErrorLocal("Ingresá tu contraseña.");
            return;
        }

        setErrorLocal("");
        onConfirmar({
            saldoReal: Number(saldoReal),
            observacion,
            usuario: usuario.trim(),
            contrasena,
        });
    };

    return (
        <CajaModal
            titulo="Cerrar caja"
            descripcion="Revisá el resumen del turno y contá el efectivo antes de cerrar."
            icono={LuLock}
            onCerrar={onCerrar}
            onConfirmar={confirmar}
            textoConfirmar="Cerrar caja"
            procesando={procesando}
            error={errorLocal || error}
            peligro
        >
            <dl className={styles.resumen}>
                <div>
                    <dt>Apertura</dt>
                    <dd>{dinero(resumen.apertura)}</dd>
                </div>
                <div>
                    <dt>Ingresos en efectivo</dt>
                    <dd className={styles.verde}>
                        {dinero(resumen.ingresosEfectivo)}
                    </dd>
                </div>
                <div>
                    <dt>Tarjeta / transferencia</dt>
                    <dd>{dinero(resumen.ingresosElectronicos)}</dd>
                </div>
                <div>
                    <dt>Egresos</dt>
                    <dd className={styles.rojo}>- {dinero(resumen.egresos)}</dd>
                </div>
                <div>
                    <dt>Egresos en efectivo</dt>
                    <dd className={styles.rojo}>- {dinero(resumen.egresosEfectivo)}</dd>
                </div>
                <div>
                    <dt>Propinas</dt>
                    <dd>{dinero(resumen.propinas)}</dd>
                </div>
                <div className={styles.esperado}>
                    <dt>Saldo esperado</dt>
                    <dd>{dinero(resumen.saldoEsperado)}</dd>
                </div>
            </dl>

            <label className={styles.campo} htmlFor="caja-saldo-real">
                <span className={styles.etiqueta}>Saldo real contado</span>
                <input
                    id="caja-saldo-real"
                    className={styles.input}
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={saldoReal}
                    onChange={(evento) => setSaldoReal(evento.target.value)}
                />
            </label>

            <label className={styles.campo} htmlFor="cierre-usuario">
                <span className={styles.etiqueta}>Usuario</span>
                <input
                    id="cierre-usuario"
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

            <label className={styles.campo} htmlFor="cierre-contrasena">
                <span className={styles.etiqueta}>Contraseña</span>
                <div className={styles.clave}>
                    <input
                        id="cierre-contrasena"
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
                        {verContrasena ? <LuEyeOff /> : <LuEye />}
                    </button>
                </div>
            </label>

            <p
                className={`${styles.diferencia} ${
                    diferencia === 0
                        ? styles.neutro
                        : diferencia > 0
                          ? styles.verde
                          : styles.rojo
                }`}
            >
                Diferencia: <strong>{dinero(diferencia)}</strong>
                {diferencia > 0 && " (sobrante)"}
                {diferencia < 0 && " (faltante)"}
            </p>

            <label className={styles.campo} htmlFor="caja-observacion">
                <span className={styles.etiqueta}>Observación (opcional)</span>
                <textarea
                    id="caja-observacion"
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    maxLength={240}
                    placeholder="Ej.: faltó cambio, se pagó un insumo..."
                    value={observacion}
                    onChange={(evento) => setObservacion(evento.target.value)}
                />
            </label>
        </CajaModal>
    );
}
