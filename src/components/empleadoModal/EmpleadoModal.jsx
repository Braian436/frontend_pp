
import { useState } from "react";
import styles from "./EmpleadoModal.module.css";

export default function EmpleadoModal({ empleado, cerrar, guardar }) {
    const [form, setForm] = useState({
        nombre: empleado?.nombre || "",
        dni: empleado?.dni || "",
        rol: empleado?.rol || "Barbero",
        password: "",
        estado: empleado?.estado || "activo",
        comision: empleado?.comision ?? 15,
        foto: empleado?.foto || null,
    });

    const [archivoFoto, setArchivoFoto] = useState(null);
    const [preview, setPreview] = useState(empleado?.foto || null);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [errorFoto, setErrorFoto] = useState("");

    const cambiar = (e) => {
        const { name, value } = e.target;

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

        guardar({
        ...form,
        comision: Number(form.comision),
        archivoFoto,
        foto: preview,
        });
    };

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
                        Nombre y apellido *
                        </label>

                        <input
                        id="nombreEmpleado"
                        type="text"
                        name="nombre"
                        className={`form-control ${styles.input}`}
                        placeholder="Ej. Enzo Figueroa"
                        value={form.nombre}
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
                        <label
                        htmlFor="rolEmpleado"
                        className="form-label"
                        >
                            Rol *
                        </label>

                        <select
                        id="rolEmpleado"
                        name="rol"
                        className={`form-select ${styles.input}`}
                        value={form.rol}
                        onChange={cambiar}
                        required
                        >
                        <option value="Barbero">Barbero</option>
                        <option value="Cajero">Cajero</option>
                        <option value="Administrador">
                            Administrador
                        </option>
                        </select>
                    </div>

                    {/* CONTRASEÑA */}
                    <div className="col-12 col-md-6">
                        <label
                        htmlFor="passwordEmpleado"
                        className="form-label"
                        >
                        {empleado
                            ? "Nueva contraseña"
                            : "Contraseña *"}
                        </label>

                        <div className="input-group">
                        <input
                            id="passwordEmpleado"
                            type={mostrarPassword ? "text" : "password"}
                            name="password"
                            className={`form-control ${styles.input}`}
                            placeholder={
                            empleado
                                ? "Sin cambios"
                                : "Mínimo 8 caracteres"
                            }
                            value={form.password}
                            onChange={cambiar}
                            minLength={8}
                            required={!empleado}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className={`btn ${styles.botonPassword}`}
                            onClick={() =>
                            setMostrarPassword(!mostrarPassword)
                            }
                            aria-label={
                            mostrarPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                        >
                            {mostrarPassword ? "Ocultar" : "Ver"}
                        </button>
                        </div>

                        {empleado && (
                        <small className="text-secondary">
                            Dejá vacío para conservar la contraseña.
                        </small>
                        )}
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
                    >
                    {empleado
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
