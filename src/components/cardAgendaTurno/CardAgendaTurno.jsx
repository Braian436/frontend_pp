import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import FilaTurno from "../filaTurno/FilaTurno.jsx";
import FormularioTurno from "../formularioTurno/FormularioTurno.jsx";
import styles from "./CardAgendaTurno.module.css";

export default function CardAgendaTurno({ barbero, fecha, onCambiarDia, onRegistrar, onIniciar }) {
    const [formAbierto, setFormAbierto] = useState(false);
    const [filtro, setFiltro] = useState("todos");

    const contar = (estado) =>
        barbero.turnos.filter((t) => t.estado === estado).length;

    // Botones del resumen: cada uno filtra por su estado
    const filtros = [
        { clave: "todos", texto: "todos", clase: styles.resumenTodos, cantidad: barbero.turnos.length },
        { clave: "finalizado", texto: "finalizado", clase: styles.resumenFinalizado, cantidad: contar("finalizado") },
        { clave: "en_curso", texto: "en curso", clase: styles.resumenEnCurso, cantidad: contar("en_curso") },
        { clave: "pendiente", texto: "pendiente", clase: styles.resumenPendiente, cantidad: contar("pendiente") },
    ];

    // Lista que se muestra según el filtro elegido
    const turnosMostrados =
        filtro === "todos"
            ? barbero.turnos
            : barbero.turnos.filter((t) => t.estado === filtro);

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

            {/* Resumen: cada botón filtra la lista */}
            <div className="d-flex flex-wrap gap-2 mb-3">
                {filtros.map((f) => (
                    <button
                        key={f.clave}
                        type="button"
                        className={`${styles.resumen} ${f.clase} ${filtro === f.clave ? styles.activo : ""}`}
                        onClick={() => setFiltro(f.clave)}
                    >
                        {f.cantidad} {f.texto}
                    </button>
                ))}
            </div>

            {/* Turnos */}
            <div className="d-flex flex-column gap-2">
                {turnosMostrados.length === 0 && (
                    <p className={styles.vacio}>No hay turnos para mostrar.</p>
                )}

                {turnosMostrados.map((turno) => (
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