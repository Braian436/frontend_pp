import { LuArrowDownToLine, LuArrowUpFromLine, LuLock, LuPlus, LuUsers, LuWallet } from "react-icons/lu";
import styles from "./AccesosCajero.module.css";

export default function AccesosCajero({
    cerrada,
    onTickets,
    onIngreso,
    onEgreso,
    onCaja,
    onAsistencias,
    onBloqueado,
}) {
    const ejecutar = (accion) => {
        if (cerrada) {
            onBloqueado?.();
            return;
        }
        accion?.();
    };

    const claseBoton = (primaria = false) =>
        `btn w-100 ${styles.accion} ${primaria ? styles.primaria : ""} ${
            cerrada ? styles.inactivo : ""
        }`;

    return (
        <section>
            <h2 className={styles.titulo}>Accesos rápidos</h2>
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl">
                    <button
                        type="button"
                        className={claseBoton(true)}
                        onClick={() => ejecutar(onTickets)}
                    >
                        <LuPlus aria-hidden="true" /> Cobrar ticket
                    </button>
                </div>
                <div className="col-12 col-md-6 col-xl">
                    <button
                        type="button"
                        className={claseBoton()}
                        onClick={() => ejecutar(onIngreso)}
                    >
                        <LuArrowUpFromLine aria-hidden="true" /> Nuevo ingreso
                    </button>
                </div>
                <div className="col-12 col-md-6 col-xl">
                    <button
                        type="button"
                        className={claseBoton()}
                        onClick={() => ejecutar(onEgreso)}
                    >
                        <LuArrowDownToLine aria-hidden="true" /> Nuevo egreso
                    </button>
                </div>
                <div className="col-12 col-md-6 col-xl">
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
                <div className="col-12 col-md-6 col-xl">
                    <button
                        type="button"
                        className={claseBoton()}
                        onClick={() => ejecutar(onAsistencias)}
                    >
                        <LuUsers aria-hidden="true" /> Asistencias
                    </button>
                </div>
            </div>
        </section>
    );
}
