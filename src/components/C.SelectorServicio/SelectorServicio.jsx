import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import styles from "./SelectorServicio.module.css";

// Lista de servicios (después la podés reemplazar por los de tu API)
const servicios = [
    "Corte de pelo",
    "Corte + barba",
    "Perfilado de barba",
    "Corte clásico",
    "Tintura",
    "Lavado y peinado",
];

export default function SelectorServicio({ valor, onCambiar }) {
    const [abierto, setAbierto] = useState(false);

    function elegir(nombre) {
        onCambiar(nombre);
        setAbierto(false);
    }

    return (
        <div className={styles.contenedor}>
            <button type="button" className={styles.boton} onClick={() => setAbierto(!abierto)}>
                <span className={valor ? "" : styles.placeholder}>
                    {valor || "Elegí un servicio"}
                </span>
                <LuChevronDown aria-hidden="true" />
            </button>

            {abierto && (
                <ul className={styles.lista}>
                    {servicios.map((nombre) => (
                        <li key={nombre}>
                            <button type="button" className={styles.opcion} onClick={() => elegir(nombre)}>
                                {nombre}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}