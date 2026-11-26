import { useEffect, useState } from "react";
import EmpleadoCard from "../../components/empleadoCard/EmpleadoCard";
import EmpleadoFiltros from "../../components/empleadoFiltro/EmpleadoFiltro";
import EmpleadoModal from "../../components/empleadoModal/EmpleadoModal";
import { apiRequest } from "../../api/apiRequest.js";
import styles from "./Administrador.module.css";
import { construirEmpleado, extraerFilas, normalizarEmpleado, useCrudApi } from "./adminCrud.js";

export default function Empleados() {
  const crud = useCrudApi("/empleados/", "empleados");
  const empleados = crud.items.map(normalizarEmpleado);

  const [gruposUsuario, setGruposUsuario] = useState([]);
  const [errorOpciones, setErrorOpciones] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState(null);

  useEffect(() => {
    let activo = true;
    const cargarOpciones = async () => {
      try {
        const gruposData = await apiRequest("/grupos/");
        if (!activo) return;
        setGruposUsuario(extraerFilas(gruposData, "groups"));
      } catch (fallo) {
        if (activo) setErrorOpciones(fallo.message);
      }
    };

    void cargarOpciones();
    return () => {
      activo = false;
    };
  }, []);

  const empleadosFiltrados = empleados.filter((empleado) => {
    const texto = busqueda.toLowerCase().trim();

    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(texto) ||
      String(empleado.dni).includes(texto);

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

  const guardarEmpleado = async (datos) => {
    const { archivoFoto, ...body } = datos;
    void archivoFoto;
    const payload = construirEmpleado(body);
    const ok = empleadoEditar
      ? await crud.editar(empleadoEditar, payload)
      : await crud.crear(payload);
    if (ok) cerrarModal();
  };

  const eliminarEmpleado = (empleado) => {
    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.trim();
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar a ${nombreCompleto}?`
    );

    if (!confirmar) return;

    crud.eliminar(empleado);
  };

  return (
    <section className={`min-vh-100 py-3 pb-5 ${styles.pagina}`}>
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

        {errorOpciones && <p className="text-danger text-center" role="alert">{errorOpciones}</p>}
        {crud.loading && <p className="text-secondary text-center py-4" role="status">Cargando empleados...</p>}
        {crud.error && <p className="text-danger text-center py-2" role="alert">{crud.error}</p>}

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
          saving={crud.saving}
          error={crud.error}
          grupos={gruposUsuario}
        />
      )}

    </section>
  );
}
