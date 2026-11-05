import { useId, useState } from "react";
import {
    FaCalendarAlt,
    FaCheck,
    FaEye,
    FaEyeSlash,
    FaImage,
    FaSpinner,
    FaTrash,
    FaUpload,
    FaUser,
} from "react-icons/fa";
import { ESTADOS } from "../../data/empleados.js";
import { formatearFechaHora, obtenerIniciales } from "../../utils/empleados.js";
import { procesarImagen } from "../../utils/imagen.js";
import styles from "./FormularioEmpleado.module.css";

function Campo({ etiqueta, htmlFor, error, ayuda, requerido, children }) {
    const contenidoEtiqueta = (
        <>
            {etiqueta}
            {requerido && <span className={styles.requerido}>*</span>}
        </>
    );

    return (
        <div className={styles.campo}>
            {htmlFor ? (
                <label className={styles.etiqueta} htmlFor={htmlFor}>
                    {contenidoEtiqueta}
                </label>
            ) : (
                <span className={styles.etiqueta}>{contenidoEtiqueta}</span>
            )}
            {children}
            {error ? (
                <p className={styles.error} role="alert">{error}</p>
            ) : (
                ayuda && <p className={styles.ayuda}>{ayuda}</p>
            )}
        </div>
    );
}

export default function FormularioEmpleado({
    empleado = null,
    empleados = [],
    onGuardar,
    onCancelar,
    textoGuardar,
}) {
    const idBase = useId();
    const modoEdicion = Boolean(empleado);

    const [valores, setValores] = useState({
        nombre: empleado?.nombre ?? "",
        foto: empleado?.foto ?? "",
        dni: empleado?.dni ?? "",
        password: "",
        estado: empleado?.estado ?? "activo",
        comisiones: String(empleado?.comisiones ?? 15),
    });
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [procesandoFoto, setProcesandoFoto] = useState(false);
    const [errorFoto, setErrorFoto] = useState("");

    const actualizar = (campo, valor) => {
        setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
        setErrores((anteriores) => ({ ...anteriores, [campo]: undefined }));
        setErrorGeneral("");
    };

    const manejarFoto = async (evento) => {
        const archivo = evento.target.files?.[0];
        evento.target.value = "";
        if (!archivo) return;

        setErrorFoto("");
        setProcesandoFoto(true);

        try {
            const dataUrl = await procesarImagen(archivo);
            actualizar("foto", dataUrl);
        } catch (error) {
            setErrorFoto(error.message);
        } finally {
            setProcesandoFoto(false);
        }
    };

    const validar = () => {
        const nuevosErrores = {};
        const dni = valores.dni.replace(/\D/g, "");

        if (valores.nombre.trim().length < 3) {
            nuevosErrores.nombre = "Ingresá el nombre y apellido del empleado.";
        }

        if (!/^\d{7,8}$/.test(dni)) {
            nuevosErrores.dni = "El DNI debe tener 7 u 8 números, sin puntos.";
        } else if (
            empleados.some(
                (otro) => otro.dni === dni && otro.id !== empleado?.id
            )
        ) {
            nuevosErrores.dni = "Ya existe un empleado registrado con ese DNI.";
        }

        if (!modoEdicion && valores.password.length < 6) {
            nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";
        } else if (modoEdicion && valores.password && valores.password.length < 6) {
            nuevosErrores.password = "La nueva contraseña debe tener al menos 6 caracteres.";
        }

        const comisiones = valores.comisiones === "" ? NaN : Number(valores.comisiones);
        if (Number.isNaN(comisiones) || comisiones < 0 || comisiones > 100) {
            nuevosErrores.comisiones = "Ingresá un porcentaje entre 0 y 100.";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const manejarEnvio = async (evento) => {
        evento.preventDefault();
        setErrorGeneral("");

        if (!validar()) return;

        const datos = {
            nombre: valores.nombre.trim().replace(/\s+/g, " "),
            foto: valores.foto,
            dni: valores.dni.replace(/\D/g, ""),
            estado: valores.estado,
            comisiones: Number(valores.comisiones),
        };

        if (valores.password) {
            datos.password = valores.password;
        }

        try {
            await onGuardar(datos);
        } catch (error) {
            setErrorGeneral(
                error?.message || "No se pudo guardar el empleado. Intentá nuevamente."
            );
        }
    };

    return (
        <form className={styles.formulario} onSubmit={manejarEnvio} noValidate>
            {errorGeneral && (
                <p className={styles.alertaGeneral} role="alert">{errorGeneral}</p>
            )}

            <section className={styles.seccionFoto}>
                <div className={styles.avatarContenedor}>
                    {valores.foto ? (
                        <img
                            src={valores.foto}
                            alt="Vista previa de la foto del empleado"
                            className={styles.avatar}
                        />
                    ) : (
                        <span className={styles.avatarVacio} aria-hidden="true">
                            {obtenerIniciales(valores.nombre) || <FaUser />}
                        </span>
                    )}
                    {procesandoFoto && (
                        <span className={styles.avatarCargando} aria-label="Procesando imagen">
                            <FaSpinner className={styles.girando} />
                        </span>
                    )}
                </div>

                <div className={styles.fotoInformacion}>
                    <h3 className={styles.fotoTitulo}>Foto del empleado</h3>
                    <p className={styles.fotoAyuda}>
                        Usá una foto cuadrada o vertical. Se optimiza automáticamente
                        antes de guardarla.
                    </p>

                    <div className={styles.fotoAcciones}>
                        <label className={styles.botonSubir}>
                            <FaUpload aria-hidden="true" />
                            {procesandoFoto ? "Procesando..." : "Subir foto"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={manejarFoto}
                                disabled={procesandoFoto}
                                hidden
                            />
                        </label>

                        {valores.foto && !procesandoFoto && (
                            <button
                                type="button"
                                className={styles.botonQuitar}
                                onClick={() => actualizar("foto", "")}
                            >
                                <FaTrash aria-hidden="true" />
                                Quitar
                            </button>
                        )}
                    </div>

                    {errorFoto ? (
                        <p className={styles.error} role="alert">{errorFoto}</p>
                    ) : (
                        <p className={styles.fotoFormato}>
                            <FaImage aria-hidden="true" /> JPG, PNG o WebP · máx. 5 MB
                        </p>
                    )}
                </div>
            </section>

            <div className={styles.gridDos}>
                <Campo
                    etiqueta="Nombre y apellido"
                    htmlFor={`${idBase}-nombre`}
                    error={errores.nombre}
                    requerido
                >
                    <input
                        id={`${idBase}-nombre`}
                        className={`${styles.input} ${errores.nombre ? styles.inputError : ""}`}
                        type="text"
                        value={valores.nombre}
                        onChange={(evento) => actualizar("nombre", evento.target.value)}
                        placeholder="Ej. Enzo Figueroa"
                        autoComplete="name"
                        aria-invalid={Boolean(errores.nombre)}
                    />
                </Campo>

                <Campo
                    etiqueta="DNI"
                    htmlFor={`${idBase}-dni`}
                    error={errores.dni}
                    ayuda="7 u 8 números, sin puntos."
                    requerido
                >
                    <input
                        id={`${idBase}-dni`}
                        className={`${styles.input} ${errores.dni ? styles.inputError : ""}`}
                        type="text"
                        inputMode="numeric"
                        value={valores.dni}
                        onChange={(evento) =>
                            actualizar("dni", evento.target.value.replace(/\D/g, "").slice(0, 8))
                        }
                        placeholder="30123456"
                        autoComplete="off"
                        aria-invalid={Boolean(errores.dni)}
                    />
                </Campo>
            </div>

            <Campo
                etiqueta={modoEdicion ? "Nueva contraseña" : "Contraseña"}
                htmlFor={`${idBase}-password`}
                error={errores.password}
                ayuda={
                    modoEdicion
                        ? "Dejala en blanco para conservar la contraseña actual."
                        : "Mínimo 6 caracteres."
                }
                requerido={!modoEdicion}
            >
                <div className={styles.passwordContenedor}>
                    <input
                        id={`${idBase}-password`}
                        className={`${styles.input} ${styles.inputPassword} ${errores.password ? styles.inputError : ""}`}
                        type={mostrarPassword ? "text" : "password"}
                        value={valores.password}
                        onChange={(evento) => actualizar("password", evento.target.value)}
                        placeholder={modoEdicion ? "Sin cambios" : "Contraseña de acceso"}
                        autoComplete="new-password"
                        aria-invalid={Boolean(errores.password)}
                    />
                    <button
                        type="button"
                        className={styles.botonOjo}
                        onClick={() => setMostrarPassword((visible) => !visible)}
                        aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </Campo>

            <fieldset className={styles.grupoEstado}>
                <legend className={styles.etiqueta}>Estado</legend>
                <div className={styles.estados}>
                    {ESTADOS.map((estado) => {
                        const seleccionado = valores.estado === estado.valor;

                        return (
                            <label
                                key={estado.valor}
                                className={[
                                    styles.estadoOpcion,
                                    styles[estado.valor],
                                    seleccionado ? styles.estadoSeleccionado : "",
                                ].join(" ")}
                            >
                                <input
                                    type="radio"
                                    name={`${idBase}-estado`}
                                    value={estado.valor}
                                    checked={seleccionado}
                                    onChange={() => actualizar("estado", estado.valor)}
                                    className={styles.radioOculto}
                                />
                                <span className={styles.estadoPunto} aria-hidden="true" />
                                <span className={styles.estadoTexto}>
                                    <strong>{estado.etiqueta}</strong>
                                    <small>{estado.descripcion}</small>
                                </span>
                                <span className={styles.estadoCheck} aria-hidden="true">
                                    {seleccionado && <FaCheck />}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </fieldset>

            <div className={styles.gridDos}>
                <Campo
                    etiqueta="Porcentaje de comisiones"
                    htmlFor={`${idBase}-comisiones`}
                    error={errores.comisiones}
                    requerido
                >
                    <div className={styles.comisionContenedor}>
                        <input
                            className={styles.controlRango}
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={Number(valores.comisiones) || 0}
                            onChange={(evento) => actualizar("comisiones", evento.target.value)}
                            aria-label="Porcentaje de comisiones"
                            style={{ "--progreso": `${Number(valores.comisiones) || 0}%` }}
                        />
                        <div className={styles.comisionNumero}>
                            <input
                                id={`${idBase}-comisiones`}
                                className={`${styles.input} ${styles.inputComision} ${errores.comisiones ? styles.inputError : ""}`}
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={valores.comisiones}
                                onChange={(evento) => actualizar("comisiones", evento.target.value)}
                                aria-invalid={Boolean(errores.comisiones)}
                            />
                            <span aria-hidden="true">%</span>
                        </div>
                    </div>
                </Campo>

                <Campo
                    etiqueta="Fecha de alta"
                    ayuda={
                        modoEdicion
                            ? "La fecha de alta no se puede modificar."
                            : "Se registra automáticamente al guardar."
                    }
                >
                    <div className={styles.fechaAutomatica}>
                        <FaCalendarAlt aria-hidden="true" />
                        <span>
                            {modoEdicion
                                ? formatearFechaHora(empleado.fechaAlta)
                                : "Automática al crear el empleado"}
                        </span>
                    </div>
                </Campo>
            </div>

            <div className={styles.acciones}>
                {onCancelar && (
                    <button type="button" className={styles.botonCancelar} onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className={styles.botonGuardar} disabled={procesandoFoto}>
                    {textoGuardar || (modoEdicion ? "Guardar cambios" : "Crear empleado")}
                </button>
            </div>
        </form>
    );
}
