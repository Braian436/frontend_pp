import { useMemo, useState } from "react";
import {
    LuCheck,
    LuLogIn,
    LuLogOut,
    LuPencil,
    LuSearch,
    LuUserX,
} from "react-icons/lu";

import { fechaHoy, useAsistencias } from "./asistenciasApi.js";
import styles from "./AsistenciasCajero.module.css";

const ESTADOS = {
    presente: { texto: "Presente", clase: "presente" },
    ausente: { texto: "Ausente", clase: "ausente" },
    justificado: { texto: "Justificado", clase: "justificado" },
};

const formatearFecha = (fecha) => {
    const texto = new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const iniciales = (fila) =>
    `${fila.nombre?.[0] ?? ""}${fila.apellido?.[0] ?? ""}`.toUpperCase();

export default function AsistenciasCajero() {
    const {
        fecha,
        setFecha,
        filas,
        resumen,
        cargando,
        procesando,
        error,
        limpiarError,
        registrarEntrada,
        registrarSalida,
        marcarAusencia,
        guardarRegistro,
    } = useAsistencias();

    const [busqueda, setBusqueda] = useState("");
    const [modal, setModal] = useState(null);
    const [estadoModal, setEstadoModal] = useState("ausente");
    const [observacion, setObservacion] = useState("");

    const esHoy = fecha === fechaHoy();
    const texto = busqueda.trim().toLowerCase();

    const filtradas = useMemo(
        () =>
            filas.filter((fila) => {
                if (!texto) return true;
                return `${fila.nombre} ${fila.apellido} ${fila.rol}`
                    .toLowerCase()
                    .includes(texto);
            }),
        [filas, texto]
    );

    const abrirModal = (fila, modo) => {
        limpiarError();
        setModal({ fila, modo });
        setEstadoModal(modo === "ausencia" ? "ausente" : fila.estado || "presente");
        setObservacion(fila.observacion || "");
    };

    const cerrarModal = () => {
        setModal(null);
        setObservacion("");
    };

    const confirmarModal = async () => {
        if (!modal) return;
        const { fila, modo } = modal;
        const ok =
            modo === "ausencia"
                ? await marcarAusencia(fila, estadoModal, observacion.trim())
                : await guardarRegistro(fila, {
                      estado: estadoModal,
                      observacion: observacion.trim(),
                  });
        if (ok) cerrarModal();
    };

    const accionesFila = (fila) => {
        if (!esHoy) return null;

        if (!fila.estado) {
            return (
                <>
                    <button
                        type="button"
                        className={`${styles.boton} ${styles.entrada}`}
                        onClick={() => registrarEntrada(fila)}
                        disabled={procesando}
                    >
                        <LuLogIn aria-hidden="true" /> Entrada
                    </button>
                    <button
                        type="button"
                        className={`${styles.boton} ${styles.ausencia}`}
                        onClick={() => abrirModal(fila, "ausencia")}
                        disabled={procesando}
                    >
                        <LuUserX aria-hidden="true" /> Ausencia
                    </button>
                </>
            );
        }

        return (
            <>
                {fila.estado === "presente" && !fila.hora_salida && (
                    <button
                        type="button"
                        className={`${styles.boton} ${styles.salida}`}
                        onClick={() => registrarSalida(fila)}
                        disabled={procesando}
                    >
                        <LuLogOut aria-hidden="true" /> Salida
                    </button>
                )}
                <button
                    type="button"
                    className={styles.boton}
                    onClick={() => abrirModal(fila, "editar")}
                    disabled={procesando}
                >
                    <LuPencil aria-hidden="true" /> Editar
                </button>
            </>
        );
    };

    return (
        <section className={`min-vh-100 ${styles.pagina}`}>
            <div className="container-fluid px-3 px-lg-5 py-4">
                <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
                    <div>
                        <span className={styles.etiqueta}>Panel de caja</span>
                        <h1 className={styles.titulo}>Asistencias</h1>
                        <p className={styles.descripcion}>
                            Registrá la entrada, la salida y las ausencias del
                            equipo.
                        </p>
                    </div>
                    <span
                        className={`${styles.estado} ${esHoy ? "" : styles.otroDia}`}
                    >
                        <span /> {esHoy ? "Hoy" : "Otro día"}
                    </span>
                </div>

                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                <div className={styles.barra}>
                    <div className={styles.campoFecha}>
                        <label htmlFor="fechaAsistencias">Fecha</label>
                        <input
                            id="fechaAsistencias"
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>

                    <label className={styles.buscador}>
                        <LuSearch aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Buscar por nombre o rol..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            aria-label="Buscar empleados"
                        />
                    </label>
                </div>

                <div className={styles.resumen}>
                    <div className={`${styles.miniCard} ${styles.verde}`}>
                        <small>Presentes</small>
                        <strong>{resumen.presentes}</strong>
                    </div>
                    <div className={`${styles.miniCard} ${styles.rojo}`}>
                        <small>Ausentes</small>
                        <strong>{resumen.ausentes}</strong>
                    </div>
                    <div className={`${styles.miniCard} ${styles.ambar}`}>
                        <small>Justificados</small>
                        <strong>{resumen.justificados}</strong>
                    </div>
                    <div className={`${styles.miniCard} ${styles.neutro}`}>
                        <small>Sin registrar</small>
                        <strong>{resumen.sin_registrar}</strong>
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelCabecera}>
                        <h2>{formatearFecha(fecha)}</h2>
                        <span>
                            {cargando
                                ? "Cargando..."
                                : `${filtradas.length} de ${resumen.total} empleados`}
                        </span>
                    </div>

                    {cargando ? (
                        <p className={styles.vacio} role="status">
                            Cargando asistencias...
                        </p>
                    ) : filtradas.length === 0 ? (
                        <p className={styles.vacio}>
                            No se encontraron empleados.
                        </p>
                    ) : (
                        <ul className={styles.lista}>
                            {filtradas.map((fila) => {
                                const estado = fila.estado
                                    ? ESTADOS[fila.estado]
                                    : null;

                                return (
                                    <li
                                        key={fila.id_empleado}
                                        className={styles.fila}
                                    >
                                        <span className={styles.avatar}>
                                            {iniciales(fila)}
                                        </span>

                                        <span className={styles.datos}>
                                            <span className={styles.nombre}>
                                                {fila.nombre} {fila.apellido}
                                            </span>
                                            <span className={styles.rol}>
                                                {fila.rol || "Sin rol"}
                                            </span>
                                        </span>

                                        <div className={styles.horas}>
                                            <span className={styles.hora}>
                                                <small>Entrada</small>
                                                <strong>
                                                    {fila.hora_entrada || "—"}
                                                </strong>
                                            </span>
                                            <span className={styles.hora}>
                                                <small>Salida</small>
                                                <strong>
                                                    {fila.hora_salida || "—"}
                                                </strong>
                                            </span>
                                        </div>

                                        <span
                                            className={`${styles.badge} ${
                                                estado
                                                    ? styles[estado.clase]
                                                    : styles.pendiente
                                            }`}
                                        >
                                            {estado ? estado.texto : "Sin registrar"}
                                        </span>

                                        <div className={styles.acciones}>
                                            {accionesFila(fila)}
                                        </div>

                                        {fila.observacion && (
                                            <p className={styles.observacion}>
                                                {fila.observacion}
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className={styles.pie}>
                        <span>
                            {esHoy
                                ? "Podés registrar asistencias del día de hoy."
                                : "Solo lectura: elegí la fecha de hoy para registrar."}
                        </span>
                        <span>
                            Presentes <strong>{resumen.presentes}</strong> /{" "}
                            {resumen.total}
                        </span>
                    </div>
                </div>
            </div>

            {modal && (
                <div className={styles.overlay}>
                    <div
                        className={`${styles.modal} scrollbar-app`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tituloAsistencia"
                    >
                        <h3 id="tituloAsistencia">
                            {modal.modo === "ausencia"
                                ? "Marcar ausencia"
                                : "Editar asistencia"}
                        </h3>
                        <p>
                            {modal.fila.nombre} {modal.fila.apellido}
                        </p>

                        <label htmlFor="estadoAsistencia">Estado</label>
                        <select
                            id="estadoAsistencia"
                            value={estadoModal}
                            onChange={(e) => setEstadoModal(e.target.value)}
                        >
                            {modal.modo === "ausencia" ? (
                                <>
                                    <option value="ausente">Ausente</option>
                                    <option value="justificado">
                                        Justificado
                                    </option>
                                </>
                            ) : (
                                Object.entries(ESTADOS).map(([valor, datos]) => (
                                    <option key={valor} value={valor}>
                                        {datos.texto}
                                    </option>
                                ))
                            )}
                        </select>

                        <label htmlFor="observacionAsistencia">
                            Observación
                        </label>
                        <textarea
                            id="observacionAsistencia"
                            value={observacion}
                            maxLength={200}
                            onChange={(e) => setObservacion(e.target.value)}
                            placeholder="Opcional: motivo, certificado, etc."
                        />

                        <div className={styles.modalAcciones}>
                            <button
                                type="button"
                                className={styles.modalCancelar}
                                onClick={cerrarModal}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={styles.modalGuardar}
                                onClick={confirmarModal}
                                disabled={procesando}
                            >
                                <LuCheck aria-hidden="true" />{" "}
                                {procesando ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
