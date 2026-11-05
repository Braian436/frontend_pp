import { useMemo, useState } from "react";
import {
    FaExclamationTriangle,
    FaPlus,
    FaSearch,
    FaTimes,
    FaTrash,
    FaUserPlus,
    FaUsers,
} from "react-icons/fa";
import CardEmpleado from "../components/cardEmpleado/CardEmpleado.jsx";
import FormularioEmpleado from "../components/formularioEmpleado/FormularioEmpleado.jsx";
import ModalEmpleado from "../components/modalEmpleado/ModalEmpleado.jsx";
import { ESTADOS } from "../data/empleados.js";
import useEmpleados from "../hooks/useEmpleados.js";
import styles from "./Empleados.module.css";

function normalizar(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export default function Empleados() {
    const { empleados, crear, eliminar } = useEmpleados();
    const [modalCrear, setModalCrear] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");

    const conteos = useMemo(() => {
        const resultado = { todos: empleados.length };

        ESTADOS.forEach((estado) => {
            resultado[estado.valor] = empleados.filter(
                (empleado) => empleado.estado === estado.valor
            ).length;
        });

        return resultado;
    }, [empleados]);

    const filtrados = useMemo(() => {
        const termino = normalizar(busqueda);

        return empleados.filter((empleado) => {
            const coincideEstado =
                filtroEstado === "todos" || empleado.estado === filtroEstado;

            const coincideBusqueda =
                !termino ||
                normalizar(empleado.nombre).includes(termino) ||
                normalizar(empleado.dni).includes(termino);

            return coincideEstado && coincideBusqueda;
        });
    }, [empleados, filtroEstado, busqueda]);

    const crearEmpleado = (datos) => {
        crear(datos);
        setModalCrear(false);
    };

    const confirmarEliminacion = () => {
        if (!empleadoAEliminar) return;
        eliminar(empleadoAEliminar.id);
        setEmpleadoAEliminar(null);
    };

    const hayFiltrosActivos = busqueda.trim() !== "" || filtroEstado !== "todos";

    return (
        <section className={styles.pagina}>
            <div className={styles.contenedor}>
                <header className={styles.encabezado}>
                    <div>
                        <span className={styles.etiqueta}>
                            <span className={styles.linea} aria-hidden="true" />
                            Panel de administración
                        </span>
                        <h1 className={styles.titulo}>Empleados</h1>
                        <p className={styles.descripcion}>
                            Gestioná el equipo de la barbería, sus comisiones y su estado
                            de disponibilidad.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.botonNuevo}
                        onClick={() => setModalCrear(true)}
                    >
                        <FaPlus aria-hidden="true" />
                        Nuevo empleado
                    </button>
                </header>

                <div className={styles.herramientas}>
                    <div className={styles.buscador}>
                        <FaSearch className={styles.buscadorIcono} aria-hidden="true" />
                        <input
                            type="search"
                            value={busqueda}
                            onChange={(evento) => setBusqueda(evento.target.value)}
                            placeholder="Buscar por nombre o DNI..."
                            aria-label="Buscar empleados por nombre o DNI"
                        />
                        {busqueda && (
                            <button
                                type="button"
                                className={styles.limpiarBusqueda}
                                onClick={() => setBusqueda("")}
                                aria-label="Limpiar búsqueda"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <div className={styles.filtros} role="group" aria-label="Filtrar por estado">
                        <button
                            type="button"
                            className={`${styles.filtro} ${filtroEstado === "todos" ? styles.filtroActivo : ""}`}
                            onClick={() => setFiltroEstado("todos")}
                        >
                            <FaUsers aria-hidden="true" />
                            Todos
                            <span className={styles.filtroContador}>{conteos.todos}</span>
                        </button>

                        {ESTADOS.map((estado) => (
                            <button
                                key={estado.valor}
                                type="button"
                                className={`${styles.filtro} ${filtroEstado === estado.valor ? styles.filtroActivo : ""}`}
                                onClick={() => setFiltroEstado(estado.valor)}
                            >
                                <span
                                    className={`${styles.filtroPunto} ${styles[estado.valor]}`}
                                    aria-hidden="true"
                                />
                                {estado.etiqueta}
                                <span className={styles.filtroContador}>
                                    {conteos[estado.valor] ?? 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.resultados}>
                    <span>
                        {filtrados.length === 1
                            ? "1 empleado"
                            : `${filtrados.length} empleados`}
                        {hayFiltrosActivos && ` de ${empleados.length}`}
                    </span>
                    {hayFiltrosActivos && (
                        <button
                            type="button"
                            className={styles.limpiarFiltros}
                            onClick={() => {
                                setBusqueda("");
                                setFiltroEstado("todos");
                            }}
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {filtrados.length > 0 ? (
                    <div className={styles.grid}>
                        {filtrados.map((empleado) => (
                            <CardEmpleado
                                key={empleado.id}
                                empleado={empleado}
                                onEliminar={setEmpleadoAEliminar}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.vacio}>
                        <span className={styles.vacioIcono}>
                            <FaUsers aria-hidden="true" />
                        </span>
                        <h2>
                            {empleados.length === 0
                                ? "Todavía no hay empleados"
                                : "No encontramos resultados"}
                        </h2>
                        <p>
                            {empleados.length === 0
                                ? "Creá el primer empleado para empezar a armar el equipo."
                                : "Probá con otro nombre, DNI o cambiá el filtro de estado."}
                        </p>
                        {empleados.length === 0 ? (
                            <button
                                type="button"
                                className={styles.botonNuevo}
                                onClick={() => setModalCrear(true)}
                            >
                                <FaPlus aria-hidden="true" />
                                Crear empleado
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.botonSecundario}
                                onClick={() => {
                                    setBusqueda("");
                                    setFiltroEstado("todos");
                                }}
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>

            <ModalEmpleado
                show={modalCrear}
                onHide={() => setModalCrear(false)}
                titulo="Nuevo empleado"
                subtitulo="Completá los datos para sumarlo al equipo"
                icono={<FaUserPlus />}
            >
                <FormularioEmpleado
                    key={modalCrear ? "crear-abierto" : "crear-cerrado"}
                    empleados={empleados}
                    onGuardar={crearEmpleado}
                    onCancelar={() => setModalCrear(false)}
                    textoGuardar="Crear empleado"
                />
            </ModalEmpleado>

            <ModalEmpleado
                show={Boolean(empleadoAEliminar)}
                onHide={() => setEmpleadoAEliminar(null)}
                titulo="Eliminar empleado"
                subtitulo="Esta acción no se puede deshacer"
                icono={<FaTrash />}
                size="md"
            >
                {empleadoAEliminar && (
                    <div className={styles.confirmacion}>
                        <span className={styles.advertenciaIcono}>
                            <FaExclamationTriangle aria-hidden="true" />
                        </span>
                        <h3>
                            ¿Eliminar a <strong>{empleadoAEliminar.nombre}</strong>?
                        </h3>
                        <p>
                            Se borrarán sus datos, su foto y su configuración de comisiones
                            del equipo.
                        </p>

                        <div className={styles.confirmacionAcciones}>
                            <button
                                type="button"
                                className={styles.botonSecundario}
                                onClick={() => setEmpleadoAEliminar(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={styles.botonEliminar}
                                onClick={confirmarEliminacion}
                            >
                                <FaTrash aria-hidden="true" />
                                Eliminar empleado
                            </button>
                        </div>
                    </div>
                )}
            </ModalEmpleado>
        </section>
    );
}
