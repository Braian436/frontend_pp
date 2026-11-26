import { dinero, ETIQUETAS, METODOS } from "../../pages/cajero/cajaData.js";
import styles from "./TablaMovimientosCaja.module.css";

export default function TablaMovimientosCaja({ movimientos }) {
    const ordenados = [...movimientos].sort((a, b) =>
        b.hora.localeCompare(a.hora)
    );

    return (
        <div className={styles.panel}>
            <div className={styles.panelCabecera}>
                <h2>Movimientos del turno</h2>
                <span>{movimientos.length} registros</span>
            </div>

            {ordenados.length === 0 ? (
                <p className={styles.vacio}>No hay movimientos registrados.</p>
            ) : (
                <div className="table-responsive">
                    <table className={`table align-middle mb-0 ${styles.tabla}`}>
                        <thead>
                            <tr>
                                <th>Hora</th>
                                <th>Tipo</th>
                                <th>Detalle</th>
                                <th>Medio</th>
                                <th className="text-end">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenados.map((movimiento) => {
                                const positivo = ["ingreso", "cobro"].includes(
                                    movimiento.tipo
                                );
                                const negativo = ["egreso", "anulacion"].includes(
                                    movimiento.tipo
                                );

                                return (
                                    <tr key={movimiento.id}>
                                        <td className={styles.hora}>{movimiento.hora}</td>
                                        <td>
                                            <span
                                                className={`${styles.tipo} ${
                                                    styles[movimiento.tipo]
                                                }`}
                                            >
                                                {ETIQUETAS[movimiento.tipo]}
                                            </span>
                                        </td>
                                        <td>{movimiento.detalle}</td>
                                        <td className={styles.metodo}>
                                            {METODOS[movimiento.metodo] ?? "—"}
                                        </td>
                                        <td
                                            className={`text-end ${
                                                positivo
                                                    ? styles.positivo
                                                    : negativo
                                                      ? styles.negativo
                                                      : styles.neutro
                                            }`}
                                        >
                                            {negativo ? "- " : positivo ? "+ " : ""}
                                            {dinero(movimiento.monto)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
