import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaUserSlash } from "react-icons/fa";
import FormularioEmpleado from "../components/formularioEmpleado/FormularioEmpleado.jsx";
import { ESTADOS_POR_VALOR } from "../data/empleados.js";
import useEmpleados from "../hooks/useEmpleados.js";
import styles from "./EditarEmpleado.module.css";

export default function EditarEmpleado() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { empleados, actualizar } = useEmpleados();

    const empleado = empleados.find((item) => item.id === id);

    const guardarCambios = (datos) => {
        actualizar(id, datos);
        navigate("/empleados");
    };

    if (!empleado) {
        return (
            <section className={styles.pagina}>
                <div className={styles.contenedor}>
                    <div className={styles.noEncontrado}>
                        <span className={styles.noEncontradoIcono}>
                            <FaUserSlash aria-hidden="true" />
                        </span>
                        <h1>Empleado no encontrado</h1>
                        <p>
                            El empleado que buscás no existe o fue eliminado del equipo.
                        </p>
                        <Link to="/empleados" className={styles.botonVolverPrincipal}>
                            <FaArrowLeft aria-hidden="true" />
                            Volver a empleados
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    const estado = ESTADOS_POR_VALOR[empleado.estado] ?? ESTADOS_POR_VALOR.inactivo;

    return (
        <section className={styles.pagina}>
            <div className={styles.contenedor}>
                <Link to="/empleados" className={styles.volver}>
                    <FaArrowLeft aria-hidden="true" />
                    Volver a empleados
                </Link>

                <header className={styles.encabezado}>
                    <div>
                        <span className={styles.etiqueta}>Editar empleado</span>
                        <h1 className={styles.titulo}>{empleado.nombre}</h1>
                        <p className={styles.descripcion}>
                            Actualizá los datos del empleado. La fecha de alta original
                            se conserva automáticamente.
                        </p>
                    </div>

                    <span className={`${styles.estadoResumen} ${styles[estado.valor]}`}>
                        <span className={styles.estadoPunto} aria-hidden="true" />
                        {estado.etiqueta}
                    </span>
                </header>

                <div className={styles.panel}>
                    <FormularioEmpleado
                        key={empleado.id}
                        empleado={empleado}
                        empleados={empleados}
                        onGuardar={guardarCambios}
                        onCancelar={() => navigate("/empleados")}
                        textoGuardar="Guardar cambios"
                    />
                </div>
            </div>
        </section>
    );
}
