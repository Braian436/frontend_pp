import { useId, useState } from "react";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onIngresar }) {
    const id = useId();
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [verPassword, setVerPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const enviar = async (evento) => {
        evento.preventDefault();
        setError("");
        setCargando(true);

        try {
            await onIngresar({ usuario: usuario.trim(), contrasena: password });
        } catch (fallo) {
            setError(
                fallo?.message ||
                    "No pudimos iniciar sesión. Intentá de nuevo."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <form className={styles.formulario} onSubmit={enviar} aria-busy={cargando}>
            <p className={styles.bienvenido}>BIENVENIDO</p>
            <h1 className={styles.titulo}>
                Iniciar <span>sesión</span>
            </h1>
            <p className={styles.subtitulo}>Accedé a tu cuenta para continuar</p>
            <span className={styles.linea} aria-hidden="true" />

            {error && (
                <div className={`alert alert-danger ${styles.alerta}`} role="alert">
                    {error}
                </div>
            )}

            <div className={styles.campo}>
                <label
                    className={`form-label ${styles.etiqueta}`}
                    htmlFor={`${id}-usuario`}
                >
                    Usuario
                </label>
                <input
                    id={`${id}-usuario`}
                    className={`form-control ${styles.input}`}
                    type="text"
                    value={usuario}
                    onChange={(evento) => setUsuario(evento.target.value)}
                    placeholder="Tu usuario"
                    autoComplete="username"
                    required
                />
            </div>

            <div className={styles.campo}>
                <label
                    className={`form-label ${styles.etiqueta}`}
                    htmlFor={`${id}-password`}
                >
                    Contraseña
                </label>
                <div className={styles.grupoPassword}>
                    <input
                        id={`${id}-password`}
                        className={`form-control ${styles.input} ${styles.inputPassword}`}
                        type={verPassword ? "text" : "password"}
                        value={password}
                        onChange={(evento) => setPassword(evento.target.value)}
                        placeholder="Tu contraseña"
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="button"
                        className={`btn ${styles.botonVer}`}
                        onClick={() => setVerPassword((visible) => !visible)}
                        aria-label={
                            verPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                        }
                    >
                        {verPassword ? "Ocultar" : "Ver"}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className={`btn ${styles.botonIngresar}`}
                disabled={cargando}
            >
                {cargando ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                        />
                        Ingresando...
                    </>
                ) : (
                    "Iniciar sesión"
                )}
            </button>

            <p className={styles.ayuda}>
                ¿Problemas para ingresar? Contactá al administrador.
            </p>
        </form>
    );
}
