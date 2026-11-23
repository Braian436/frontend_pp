
import { useState } from "react";
import { validarCuentaEmpleado } from "../../pages/administrador/adminCrudHelpers.js";
import styles from "./EmpleadoModal.module.css";

export default function EmpleadoModal({
    empleado,
    cerrar,
    guardar,
    saving,
    error: apiError,
    roles = [],
    grupos = [],
}) {
    const [form, setForm] = useState({
        nombre: empleado?.nombre || "",
        apellido: empleado?.apellido || "",
        dni: empleado?.dni || "",
        id_rol: empleado?.rolId || "",
        estado: empleado?.estado || "activo",
        comision: empleado?.comision ?? 15,
        foto: empleado?.foto || null,
        usuario: empleado?.usuario || "",
        contrasena: "",
        grupoUsuario: empleado?.grupoUsuario || "",
    });

    const [archivoFoto, setArchivoFoto] = useState(null);
    const [preview, setPreview] = useState(empleado?.foto || null);
    const [errorFoto, setErrorFoto] = useState("");
    const [errorFormulario, setErrorFormulario] = useState("");

    const cambiar = (e) => {
        const { name, value } = e.target;
        setErrorFormulario("");

        setForm((anterior) => ({
        ...anterior,
        [name]: value,
        }));
    };

    const subirFoto = (e) => {
        const archivo = e.target.files?.[0];

        if (!archivo) return;

        const tipos = [
        "image/jpeg",
        "image/png",
        "image/webp",
        ];

        if (
        !tipos.includes(archivo.type) ||
        archivo.size > 5 * 1024 * 1024
        ) {
        setErrorFoto("La imagen debe ser JPG, PNG o WebP de hasta 5 MB.");
        e.target.value = "";
        return;
        }

        setErrorFoto("");
        setArchivoFoto(archivo);

        const lector = new FileReader();

        lector.onload = () => {
        setPreview(lector.result);
        };

        lector.readAsDataURL(archivo);
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

        const idRol = form.id_rol || String(roles[0]?.id_rol ?? "");
        if (!idRol) {
            setErrorFormulario("Seleccioná el rol laboral del empleado.");
            return;
        }

        guardar({
        ...form,
        id_rol: idRol,
        comision: Number(form.comision),
        archivoFoto,
        foto: preview,
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

                    {/* FOTOGRAFÍA */}
                    <div className={`d-flex align-items-center gap-3 mb-4 ${styles.fotoZona}`}>

                    <div className={styles.avatar}>
                        {preview ? (
                        <img
                            src={preview}
                            alt="Vista previa del empleado"
                        />
                        ) : (
                        <span>👤</span>
                        )}
                    </div>

                    <div>
                        <p className="fw-bold mb-1">
                        Foto del empleado
                        </p>

                        <p className="text-secondary small mb-2">
                        Usá una foto cuadrada o vertical.
                        </p>

                        <label
                        htmlFor="fotoEmpleado"
                        className={`btn btn-sm ${styles.botonFoto}`}
                        >
                        Subir foto
                        </label>

                        <input
                        id="fotoEmpleado"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="d-none"
                        onChange={subirFoto}
                        />

                        <p className="text-secondary small mt-2 mb-0">
                        JPG, PNG o WebP · Máximo 5 MB
                        </p>

                        {errorFoto && (
                        <p className="text-danger small mt-2 mb-0">
                            {errorFoto}
                        </p>
                        )}
                    </div>
                    </div>

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

                    {/* ROL */}
                    <div className="col-12 col-md-6">
                        <label htmlFor="rolEmpleado" className="form-label">
                            Rol laboral *
                        </label>

                        <select
                        id="rolEmpleado"
                        name="id_rol"
                        className={`form-select ${styles.input}`}
                        value={form.id_rol || String(roles[0]?.id_rol ?? "")}
                        onChange={cambiar}
                        required
                        >
                        <option value="">Seleccioná un rol laboral</option>
                        {roles.map((rol) => (
                            <option key={rol.id_rol} value={rol.id_rol}>
                                {rol.nombre}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className={`col-12 ${styles.cuentaZona}`}>
                        <div>
                            <h6 className={styles.cuentaTitulo}>Acceso al sistema (opcional)</h6>
                            <p className={styles.cuentaAyuda}>
                                {empleado?.tieneCuenta
                                    ? "Dejá vacíos los datos que no quieras modificar."
                                    : "Dejá estos campos vacíos si el empleado no necesita una cuenta."}
                            </p>
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <label htmlFor="usuarioEmpleado" className="form-label">
                                    Usuario
                                </label>
                                <input
                                    id="usuarioEmpleado"
                                    type="text"
                                    name="usuario"
                                    autoComplete="username"
                                    className={`form-control ${styles.input}`}
                                    value={form.usuario}
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
                                    <option value="">Seleccioná un grupo</option>
                                    {grupos.map((grupo) => (
                                        <option key={grupo.id} value={grupo.name}>
                                            {grupo.name}
                                        </option>
                                    ))}
                                </select>
                                {grupos.length === 0 && (
                                    <small className={styles.cuentaAyuda}>
                                        No hay grupos de Django disponibles.
                                    </small>
                                )}
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

                    {/* COMISIÓN */}
                    <div className="col-12 col-md-6">
                        <label
                        htmlFor="comisionEmpleado"
                        className="form-label"
                        >
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
