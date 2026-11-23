import { METODOS } from "../../pages/cajero/cajaData.js";
import styles from "./SelectorMetodo.module.css";

export default function SelectorMetodo({
    valor,
    onChange,
    etiqueta = "Medio de pago",
}) {
    return (
        <div className={styles.campo} role="group" aria-label={etiqueta}>
            <span className={styles.etiqueta}>{etiqueta}</span>
            <div className={styles.opciones}>
                {Object.entries(METODOS).map(([clave, texto]) => (
                    <button
                        type="button"
                        key={clave}
                        className={`${styles.opcion} ${
                            valor === clave ? styles.activo : ""
                        }`}
                        aria-pressed={valor === clave}
                        onClick={() => onChange(clave)}
                    >
                        {texto}
                    </button>
                ))}
            </div>
        </div>
    );
}
