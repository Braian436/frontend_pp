import {
    LuArrowDownToLine,
    LuArrowUpFromLine,
    LuLock,
    LuPlus,
    LuWallet,
} from "react-icons/lu";
import styles from "./AccesosCajero.module.css";

export default function AccesosCajero({
    cerrada,
    onTickets,
    onIngreso,
    onEgreso,
    onCaja,
}) {
    return (
        <section>
            <h2 className={styles.titulo}>Accesos rápidos</h2>
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <button
                        type="button"
                        className={`btn w-100 ${styles.accion} ${styles.primaria}`}
                        onClick={onTickets}
                        disabled={cerrada}
                    >
                        <LuPlus aria-hidden="true" /> Cobrar ticket
                    </button>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <button
                        type="button"
                        className={`btn w-100 ${styles.accion}`}
                        onClick={onIngreso}
                        disabled={cerrada}
                    >
                        <LuArrowUpFromLine aria-hidden="true" /> Nuevo ingreso
                    </button>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <button
                        type="button"
                        className={`btn w-100 ${styles.accion}`}
                        onClick={onEgreso}
                        disabled={cerrada}
                    >
                        <LuArrowDownToLine aria-hidden="true" /> Nuevo egreso
                    </button>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <button
                        type="button"
                        className={`btn w-100 ${styles.accion}`}
                        onClick={onCaja}
                    >
                        {cerrada ? (
                            <LuWallet aria-hidden="true" />
                        ) : (
                            <LuLock aria-hidden="true" />
                        )}
                        {cerrada ? "Abrir caja" : "Cerrar caja"}
                    </button>
                </div>
            </div>
        </section>
    );
}
