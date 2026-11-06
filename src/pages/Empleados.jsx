import { useState } from "react";
import EmpleadoCard from "../components/empleadoCard/EmpleadoCard";
import EmpleadoFiltros from "../components/empleadoFiltro/EmpleadoFiltro";
import EmpleadoModal from "../components/empleadoModal/EmpleadoModal";
import styles from "./Empleados.module.css";


const empleadosIniciales = [
  {
    id: 1,
    nombre: "Enzo Figueroa",
    dni: "30123456",
    rol: "Barbero",
    estado: "activo",
    comision: 15,
    fechaAlta: "12/03/2024",
    foto: null,
  },
  {
    id: 2,
    nombre: "Martín Acosta",
    dni: "28555111",
    rol: "Barbero",
    estado: "suspendido",
    comision: 10,
    fechaAlta: "20/01/2025",
    foto: null,
  },
  {
    id: 3,
    nombre: "Lucas Herrera",
    dni: "35777888",
    rol: "Barbero",
    estado: "inactivo",
    comision: 20,
    fechaAlta: "05/08/2023",
    foto: null,
  },
];

export default function Empleados() {
  const [empleados, setEmpleados] = useState(empleadosIniciales);

  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState(null);

  const empleadosFiltrados = empleados.filter((empleado) => {
    const texto = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      empleado.nombre.toLowerCase().includes(texto) ||
      empleado.dni.includes(texto);

    const coincideEstado =
      filtro === "todos" || empleado.estado === filtro;

    return coincideBusqueda && coincideEstado;
  });

  const nuevoEmpleado = () => {
    setEmpleadoEditar(null);
    setMostrarModal(true);
  };

  const editarEmpleado = (empleado) => {
    setEmpleadoEditar(empleado);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEmpleadoEditar(null);
  };

  const guardarEmpleado = (datos) => {
    // Datos de demostración: no se envían a Django.
    const { password, archivoFoto, ...empleadoDatos } = datos;

    // En una API real, la contraseña se enviaría
    // de forma segura al backend, no al estado.
    void password;
    void archivoFoto;

    if (empleadoEditar) {
      setEmpleados((anteriores) =>
        anteriores.map((empleado) =>
          empleado.id === empleadoEditar.id
            ? {
                ...empleado,
                ...empleadoDatos,
              }
            : empleado
        )
      );
    } else {
      const nuevo = {
        ...empleadoDatos,
        id: crypto.randomUUID(),
        fechaAlta: new Date().toLocaleDateString("es-AR"),
      };

      setEmpleados((anteriores) => [...anteriores, nuevo]);
    }

    cerrarModal();
  };

  const eliminarEmpleado = (empleado) => {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar a ${empleado.nombre}?`
    );

    if (!confirmar) return;

    setEmpleados((anteriores) =>
      anteriores.filter((e) => e.id !== empleado.id)
    );
  };

  return (
    <section className={styles.pagina}>
      <div className="container">

        {/* ENCABEZADO */}
        <div className="row align-items-center g-3 mb-4">

          <div className="col-12 col-md-8">
            <span className={styles.subtitulo}>
              — PANEL DE ADMINISTRACIÓN
            </span>

            <h1 className={styles.titulo}>
              Empleados
            </h1>

            <p className="text-secondary mb-0">
              Gestioná el equipo de la barbería,
              sus comisiones y su estado.
            </p>
          </div>

          <div className="col-12 col-md-4 text-md-end">
            <button
              type="button"
              className={`btn ${styles.botonNuevo}`}
              onClick={nuevoEmpleado}
            >
              + Nuevo empleado
            </button>
          </div>

        </div>

        {/* FILTROS */}
        <EmpleadoFiltros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtro={filtro}
          setFiltro={setFiltro}
          empleados={empleados}
        />

        {/* CANTIDAD */}
        <p className={styles.cantidad}>
          {empleadosFiltrados.length} EMPLEADOS
        </p>

        {/* TARJETAS */}
        <div className="row g-4">
          {empleadosFiltrados.map((empleado) => (
            <div
              key={empleado.id}
              className="col-12 col-md-6 col-lg-4"
            >
              <EmpleadoCard
                empleado={empleado}
                onEditar={editarEmpleado}
                onEliminar={eliminarEmpleado}
              />
            </div>
          ))}
        </div>

        {/* SIN RESULTADOS */}
        {empleadosFiltrados.length === 0 && (
          <div className="text-center py-5 text-secondary">
            No se encontraron empleados.
          </div>
        )}

      </div>

      {/* MODAL */}
      {mostrarModal && (
        <EmpleadoModal
          key={empleadoEditar?.id ?? "nuevo"}
          empleado={empleadoEditar}
          cerrar={cerrarModal}
          guardar={guardarEmpleado}
        />
      )}

    </section>
  );
}
