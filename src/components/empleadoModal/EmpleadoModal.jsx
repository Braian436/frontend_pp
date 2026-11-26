
import { useState } from "react";
import { validarCuentaEmpleado } from "../../pages/administrador/adminCrudHelpers.js";
import styles from "./EmpleadoModal.module.css";

export default function EmpleadoModal({
    empleado,
    cerrar,
    guardar,
    saving,
    error: apiError,
    grupos = [],
}) {
    const [form, setForm] = useState({
        nombre: empleado?.nombre || "",
        apellido: empleado?.apellido || "",
        dni: empleado?.dni || "",
        estado: empleado?.estado || "activo",
        comision: empleado?.comision ?? 15,
        usuario: "",
        contrasena: "",
        grupoUsuario: "",
    });

    const [errorFormulario, setErrorFormulario] = useState("");

    const cambiar = (e) => {
        const { name, value } = e.target;
        setErrorFormulario("");

        setForm((anterior) => ({
        ...anterior,
        [name]: value,
        }));
    };

    const enviar = (e) => {
        e.preventDefault();
        if (!empleado && !form.nombre.trim()) {
            setErrorFormulario("Completá el nombre del empleado.");
            return;
        }

        const errorCuenta = validarCuentaEmpleado(form, empleado?.tieneCuenta);
        if (errorCuenta) {
            setErrorFormulario(errorCuenta);
            return;
        }

        guardar({
        ...form,
        comision: Number(form.comision),
        });
    };

    const requiereCuenta = Boolean(
        form.usuario.trim() || form.contrasena || form.grupoUsuario.trim()
    );

    return (
        <div className={styles.overlay}>
        <div
            className={`modal show d-block ${styles.modal}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloEmpleado"
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">

            <div className={`modal-content ${styles.contenido}`}>

                {/* ENCABEZADO */}
                <div className={`modal-header ${styles.header}`}>

                <div>
                    <h5
                    id="tituloEmpleado"
                    className="modal-title fw-bold"
                    >
                    {empleado ? "Editar empleado" : "Nuevo empleado"}
                    </h5>

                    <p className="mb-0 mt-1 small text-secondary">
                    {empleado
                        ? "Actualizá los datos del empleado"
                        : "Completá los datos para sumar un empleado al equipo"}
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cerrar}
                    aria-label="Cerrar"
                />
                </div>

                {/* FORMULARIO */}
                <form onSubmit={enviar} className={styles.formulario}>

                <div className={`modal-body p-4 ${styles.cuerpo}`}>

                    <div className="row g-3">

                    {/* NOMBRE */}
                    <div className="col-12 col-md-6">
                        <label
                        htmlFor="nombreEmpleado"
                        className="form-label"
                        >
                        Nombre *
                        </label>

                        <input
                        id="nombreEmpleado"
                        type="text"
                        name="nombre"
                        className={`form-control ${styles.input}`}
                        placeholder="Ej. Enzo"
                        value={form.nombre}
                        onChange={cambiar}
                        required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label
                        htmlFor="apellidoEmpleado"
                        className="form-label"
                        >
                        Apellido *
                        </label>

                        <input
                        id="apellidoEmpleado"
                        type="text"
                        name="apellido"
                        className={`form-control ${styles.input}`}
                        placeholder="Ej. Figueroa"
                        value={form.apellido}
                        onChange={cambiar}
                        required
                        />
                    </div>

                    {/* DNI */}
                    <div className="col-12 col-md-6">
                        <label
                        htmlFor="dniEmpleado"
                        className="form-label"
                        >
                            DNI *
                        </label>

                        <input
                        id="dniEmpleado"
                        type="text"
                        name="dni"
                        className={`form-control ${styles.input}`}
                        placeholder="Ej. 30123456"
                        inputMode="numeric"
                        pattern="[0-9]{7,8}"
                        title="Ingresá 7 u 8 números sin puntos"
                        value={form.dni}
                        onChange={cambiar}
                        required
                        />

                        <small className="text-secondary">
                            7 u 8 números, sin puntos.
                        </small>
                    </div>

                    <div className="col-12 col-md-6">
                        <label htmlFor="grupoUsuarioEmpleado" className="form-label">
                            Grupo de acceso
                        </label>
                        <select
                            id="grupoUsuarioEmpleado"
                            name="grupoUsuario"
                            className={`form-select ${styles.input}`}
                            value={form.grupoUsuario}
                            onChange={cambiar}
                            required={requiereCuenta && !empleado?.tieneCuenta}
                        >
                            <option value="">
                                {empleado?.tieneCuenta ? "Sin cambios" : "Seleccioná un grupo"}
                            </option>
                            {grupos.map((grupo) => (
                                <option key={grupo.id} value={grupo.name}>
                                    {grupo.name}
                                </option>
                            ))}
                        </select>
                        {empleado?.tieneCuenta && (
                            <small className={styles.cuentaAyuda}>
                                Grupo actual: {empleado.grupoUsuario || "Sin grupo"}
                            </small>
                        )}
                        {grupos.length === 0 && (
                            <small className={styles.cuentaAyuda}>
                                No hay grupos de Django disponibles.
                            </small>
                        )}
                    </div>

                    <div className={`col-12 ${styles.cuentaZona}`}>
                        <div>
                            <h6 className={styles.cuentaTitulo}>Acceso al sistema (opcional)</h6>
                            {empleado?.tieneCuenta && (
                                <p className={styles.cuentaAyuda}>
                                    Usuario actual: {empleado.usuario || "Sin usuario"}
                                </p>
                            )}
                            <p className={styles.cuentaAyuda}>
                                {empleado?.tieneCuenta
                                    ? "Completá solo los campos que quieras cambiar; dejalos vacíos para no modificar la cuenta."
                                    : "Dejá estos campos vacíos si el empleado no necesita una cuenta."}
                            </p>
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <label htmlFor="usuarioEmpleado" className="form-label">
                                    {empleado?.tieneCuenta ? "Nuevo usuario" : "Usuario"}
                                </label>
                                <input
                                    id="usuarioEmpleado"
                                    type="text"
                                    name="usuario"
                                    autoComplete="username"
                                    className={`form-control ${styles.input}`}
                                    value={form.usuario}
                                    placeholder={empleado?.tieneCuenta ? "Dejar vacío para conservarlo" : ""}
                                    onChange={cambiar}
                                    required={requiereCuenta && !empleado?.tieneCuenta}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label htmlFor="contrasenaEmpleado" className="form-label">
                                    {empleado?.tieneCuenta ? "Nueva contraseña" : "Contraseña"}
                                </label>
                                <input
                                    id="contrasenaEmpleado"
                                    type="password"
                                    name="contrasena"
                                    autoComplete="new-password"
                                    className={`form-control ${styles.input}`}
                                    placeholder={empleado?.tieneCuenta ? "Dejar vacía para conservarla" : ""}
                                    value={form.contrasena}
                                    onChange={cambiar}
                                    required={requiereCuenta && !empleado?.tieneCuenta}
                                />
                            </div>

                        </div>
                    </div>

                    {/* ESTADO */}
                    <div className="col-12">
                        <label className="form-label d-block">
                        Estado
                        </label>

                        <div className="row g-2">

                        {["activo", "suspendido", "inactivo"].map(
                            (estado) => (
                            <div
                                className="col-12 col-sm-4"
                                key={estado}
                            >
                                <button
                                type="button"
                                aria-pressed={form.estado === estado}
                                className={`btn w-100 ${styles.botonEstado} ${
                                    form.estado === estado
                                    ? styles.estadoActivo
                                    : ""
                                }`}
                                onClick={() =>
                                    setForm((anterior) => ({
                                    ...anterior,
                                    estado,
                                    }))
                                }
                                >
                                <span className={styles[estado]}>
                                    ●
                                </span>
                                {" "}
                                {estado}
                                </button>
                            </div>
                            )
                        )}

                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <label htmlFor="comisionEmpleado" className="form-label">
                            Porcentaje de comisión *
                        </label>

                        <div className="d-flex align-items-center gap-3">
                            <input
                                id="comisionEmpleado"
                                type="range"
                                name="comision"
                                min="0"
                                max="100"
                                className={`form-range mb-0 ${styles.rango}`}
                                value={form.comision}
                                onChange={cambiar}
                            />

                            <span className={styles.porcentaje}>
                                {form.comision}%
                            </span>
                        </div>
                    </div>

                    {/* FECHA DE ALTA */}
                    <div className="col-12 col-md-6">
                        <label
                        htmlFor="fechaAltaEmpleado"
                        className="form-label"
                        >
                        Fecha de alta
                        </label>

                        <input
                        id="fechaAltaEmpleado"
                        type="text"
                        className={`form-control ${styles.input}`}
                        value={
                            empleado?.fechaAlta ||
                            "Automática al crear"
                        }
                        readOnly
                        />

                        <small className="text-secondary">
                        La fecha se asigna automáticamente.
                        </small>
                    </div>

                    </div>
                </div>

                {(errorFormulario || apiError) && <p className="text-danger px-4 mb-0" role="alert">{errorFormulario || apiError}</p>}

                {/* BOTONES INFERIORES */}
                <div className={`modal-footer ${styles.footerBotones}`}>

                    <button
                    type="button"
                    className={`btn ${styles.botonCancelar}`}
                    onClick={cerrar}
                    >
                    Cancelar
                    </button>

                    <button
                    type="submit"
                    className={`btn ${styles.botonGuardar}`}
                    disabled={saving}
                    >
                    {saving ? "Guardando..." : empleado
                        ? "Guardar cambios"
                        : "Crear empleado"}
                    </button>

                </div>

                </form>
            </div>
            </div>
        </div>
        </div>
    );
}
