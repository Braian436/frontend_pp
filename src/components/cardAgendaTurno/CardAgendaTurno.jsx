import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import FilaTurno from "../filaTurno/FilaTurno.jsx";
import FormularioTurno from "../formularioTurno/FormularioTurno.jsx";
import styles from "./CardAgendaTurno.module.css";

export default function CardAgendaTurno({ barbero, fecha, onCambiarDia, onRegistrar, onIniciar }) {
    const [formAbierto, setFormAbierto] = useState(false);

    const contar = (estado) =>
        barbero.turnos.filter((t) => t.estado === estado).length;

    const fechaTexto = fecha.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    function guardar(datos) {
        onRegistrar(datos);
        setFormAbierto(false);
    }

    return (
        <div className={styles.card}>
            {/* Barbero + botón reservar a la derecha */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <div className={styles.avatar}>{barbero.nombre.charAt(0).toUpperCase()}</div>
                <div>
                    <h2 className="h5 text-white mb-0">{barbero.nombre}</h2>
                    <p className={`mb-0 ${styles.especialidad}`}>{barbero.especialidad}</p>
                </div>
                <button type="button" className={`ms-auto ${styles.botonDorado}`} onClick={() => setFormAbierto(true)}>
                    RESERVAR TURNO
                </button>
            </div>

            {/* Fecha con flechas */}
            <div className={styles.selectorFecha}>
                <button type="button" className={styles.flecha} onClick={() => onCambiarDia(-1)} aria-label="Día anterior">
                    <LuChevronLeft />
                </button>
                <span className={styles.fechaTexto}>{fechaTexto}</span>
                <button type="button" className={styles.flecha} onClick={() => onCambiarDia(1)} aria-label="Día siguiente">
                    <LuChevronRight />
                </button>
            </div>

            {/* Resumen */}
            <div className="d-flex flex-wrap gap-2 mb-3">
                <span className={`${styles.resumen} ${styles.resumenFinalizado}`}>
                    {contar("finalizado")} finalizado
                </span>
                <span className={`${styles.resumen} ${styles.resumenEnCurso}`}>
                    {contar("en_curso")} en curso
                </span>
                <span className={`${styles.resumen} ${styles.resumenPendiente}`}>
                    {contar("pendiente")} pendiente
                </span>
            </div>

            {/* Turnos */}
            <div className="d-flex flex-column gap-2">
                {barbero.turnos.length === 0 && (
                    <p className={styles.vacio}>No hay turnos para este día.</p>
                )}

                {barbero.turnos.map((turno) => (
                    <FilaTurno key={turno.id} turno={turno} onIniciar={onIniciar} />
                ))}
            </div>

            {/* Tarjeta emergente para reservar */}
            {formAbierto && (
                <FormularioTurno onGuardar={guardar} onCerrar={() => setFormAbierto(false)} />
            )}
        </div>
    );
}