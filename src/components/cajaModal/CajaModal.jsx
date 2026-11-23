import { useEffect } from "react";
import styles from "./CajaModal.module.css";

export default function CajaModal({
    titulo,
    descripcion,
    icono: Icono,
    children,
    onCerrar,
    onConfirmar,
    textoConfirmar = "Confirmar",
    procesando = false,
    error = "",
    peligro = false,
}) {
    useEffect(() => {
        const cerrarConEscape = (evento) => {
            if (evento.key === "Escape") onCerrar();
        };

        document.addEventListener("keydown", cerrarConEscape);
        return () => document.removeEventListener("keydown", cerrarConEscape);
    }, [onCerrar]);

    const enviar = (evento) => {
        evento.preventDefault();
        void onConfirmar?.();
    };

    return (
        <div
            className={styles.overlay}
            role="presentation"
            onMouseDown={(evento) => {
                if (evento.target === evento.currentTarget) onCerrar();
            }}
        >
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="caja-modal-titulo"
            >
                <form className={styles.dialogo} onSubmit={enviar}>
                    <div className={`modal-content ${styles.contenido}`}>
                        <div className={`modal-header ${styles.header}`}>
                            <div className={styles.encabezado}>
                                {Icono && <Icono aria-hidden="true" />}
                                <div>
                                    <h2
                                        id="caja-modal-titulo"
                                        className={`modal-title fs-5 ${styles.titulo}`}
                                    >
                                        {titulo}
                                    </h2>
                                    {descripcion && (
                                        <p className={styles.descripcion}>
                                            {descripcion}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onCerrar}
                                aria-label="Cerrar"
                            />
                        </div>

                        <div className={`modal-body ${styles.cuerpo}`}>
                            {children}
                            {error && (
                                <p className={styles.error} role="alert">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className={`modal-footer ${styles.footer}`}>
                            <button
                                type="button"
                                className={`btn ${styles.cancelar}`}
                                onClick={onCerrar}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`btn ${peligro ? styles.peligro : styles.confirmar}`}
                                disabled={procesando}
                            >
                                {procesando ? "Guardando..." : textoConfirmar}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
