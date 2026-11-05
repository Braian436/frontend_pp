import { useId, useState } from "react";
import { FaCalendarAlt, FaCheck, FaEye, FaEyeSlash, FaImage, FaSpinner, FaTrash, FaUpload, FaUser } from "react-icons/fa";
import { ESTADOS } from "../../data/empleados.js";
import { formatearFechaHora, obtenerIniciales } from "../../utils/empleados.js";
import { procesarImagen } from "../../utils/imagen.js";
import styles from "./FormularioEmpleado.module.css";

function Campo({ etiqueta, htmlFor, error, ayuda, requerido, children }) {
    const titulo = <>{etiqueta}{requerido && <span className={styles.requerido}>*</span>}</>;
    return (
        <div className={styles.campo}>
            {htmlFor
                ? <label className={styles.etiqueta} htmlFor={htmlFor}>{titulo}</label>
                : <span className={styles.etiqueta}>{titulo}</span>}
            {children}
            {error ? <p className={styles.error} role="alert">{error}</p> : ayuda && <p className={styles.ayuda}>{ayuda}</p>}
        </div>
    );
}

function Entrada({ error, etiqueta, ayuda, requerido, id, ...props }) {
    return (
        <Campo etiqueta={etiqueta} htmlFor={id} error={error} ayuda={ayuda} requerido={requerido}>
            <input id={id} aria-invalid={Boolean(error)} className={`${styles.input} ${error ? styles.inputError : ""}`} {...props} />
        </Campo>
    );
}

export default function FormularioEmpleado({ empleado = null, empleados = [], onGuardar, onCancelar, textoGuardar }) {
    const id = useId();
    const editando = Boolean(empleado);
    const [valores, setValores] = useState({
        nombre: empleado?.nombre ?? "", foto: empleado?.foto ?? "", dni: empleado?.dni ?? "",
        password: "", estado: empleado?.estado ?? "activo", comisiones: String(empleado?.comisiones ?? 15),
    });
    const [errores, setErrores] = useState({});
    const [ui, setUi] = useState({ verPassword: false, procesando: false, errorFoto: "", errorGeneral: "" });

    const cambiarUI = (campo, valor) => setUi((actual) => ({ ...actual, [campo]: valor }));
    const cambiar = (campo, valor) => {
        setValores((actual) => ({ ...actual, [campo]: valor }));
        setErrores((actual) => ({ ...actual, [campo]: undefined }));
        cambiarUI("errorGeneral", "");
    };

    const cambiarFoto = async ({ target }) => {
        const archivo = target.files?.[0];
        target.value = "";
        if (!archivo) return;
        cambiarUI("errorFoto", "");
        cambiarUI("procesando", true);
        try { cambiar("foto", await procesarImagen(archivo)); }
        catch (error) { cambiarUI("errorFoto", error.message); }
        finally { cambiarUI("procesando", false); }
    };

    const validar = () => {
        const dni = valores.dni.replace(/\D/g, "");
        const comisiones = Number(valores.comisiones);
        const nuevos = {};
        if (valores.nombre.trim().length < 3) nuevos.nombre = "Ingresá el nombre y apellido del empleado.";
        if (!/^\d{7,8}$/.test(dni)) nuevos.dni = "El DNI debe tener 7 u 8 números, sin puntos.";
        else if (empleados.some((otro) => otro.dni === dni && otro.id !== empleado?.id)) nuevos.dni = "Ya existe un empleado registrado con ese DNI.";
        if ((!editando || valores.password) && valores.password.length < 6) nuevos.password = "La contraseña debe tener al menos 6 caracteres.";
        if (Number.isNaN(comisiones) || valores.comisiones === "" || comisiones < 0 || comisiones > 100) nuevos.comisiones = "Ingresá un porcentaje entre 0 y 100.";
        setErrores(nuevos);
        return !Object.keys(nuevos).length;
    };

    const enviar = async (evento) => {
        evento.preventDefault();
        cambiarUI("errorGeneral", "");
        if (!validar()) return;
        const { nombre, foto, dni, estado, comisiones, password } = valores;
        try {
            await onGuardar({
                nombre: nombre.trim().replace(/\s+/g, " "), foto, dni: dni.replace(/\D/g, ""), estado,
                comisiones: Number(comisiones), ...(password && { password }),
            });
        } catch (error) {
            cambiarUI("errorGeneral", error?.message || "No se pudo guardar el empleado.");
        }
    };

    return (
        <form className={styles.formulario} onSubmit={enviar} noValidate>
            {ui.errorGeneral && <p className={styles.alertaGeneral} role="alert">{ui.errorGeneral}</p>}

            <section className={styles.seccionFoto}>
                <div className={styles.avatarContenedor}>
                    {valores.foto
                        ? <img src={valores.foto} alt="Vista previa de la foto" className={styles.avatar} />
                        : <span className={styles.avatarVacio} aria-hidden="true">{obtenerIniciales(valores.nombre) || <FaUser />}</span>}
                    {ui.procesando && <span className={styles.avatarCargando}><FaSpinner className={styles.girando} /></span>}
                </div>
                <div className={styles.fotoInformacion}>
                    <h3 className={styles.fotoTitulo}>Foto del empleado</h3>
                    <p className={styles.fotoAyuda}>Usá una foto cuadrada o vertical. Se optimiza automáticamente antes de guardarla.</p>
                    <div className={styles.fotoAcciones}>
                        <label className={styles.botonSubir}>
                            <FaUpload aria-hidden="true" />
                            {ui.procesando ? "Procesando..." : "Subir foto"}
                            <input type="file" accept="image/*" onChange={cambiarFoto} disabled={ui.procesando} hidden />
                        </label>
                        {valores.foto && !ui.procesando && (
                            <button type="button" className={styles.botonQuitar} onClick={() => cambiar("foto", "")}>
                                <FaTrash aria-hidden="true" /> Quitar
                            </button>
                        )}
                    </div>
                    {ui.errorFoto
                        ? <p className={styles.error} role="alert">{ui.errorFoto}</p>
                        : <p className={styles.fotoFormato}><FaImage aria-hidden="true" /> JPG, PNG o WebP · máx. 5 MB</p>}
                </div>
            </section>

            <div className={styles.gridDos}>
                <Entrada id={`${id}-nombre`} etiqueta="Nombre y apellido" placeholder="Ej. Enzo Figueroa" autoComplete="name" requerido
                    value={valores.nombre} onChange={(e) => cambiar("nombre", e.target.value)} error={errores.nombre} />
                <Entrada id={`${id}-dni`} etiqueta="DNI" ayuda="7 u 8 números, sin puntos." inputMode="numeric" placeholder="30123456" autoComplete="off" requerido
                    value={valores.dni} error={errores.dni} onChange={(e) => cambiar("dni", e.target.value.replace(/\D/g, "").slice(0, 8))} />
            </div>

            <Campo etiqueta={editando ? "Nueva contraseña" : "Contraseña"} htmlFor={`${id}-password`}
                error={errores.password} requerido={!editando}
                ayuda={editando ? "Dejala en blanco para conservar la contraseña actual." : "Mínimo 6 caracteres."}>
                <div className={styles.passwordContenedor}>
                    <input id={`${id}-password`} className={`${styles.input} ${styles.inputPassword} ${errores.password ? styles.inputError : ""}`}
                        type={ui.verPassword ? "text" : "password"} value={valores.password}
                        onChange={(e) => cambiar("password", e.target.value)} placeholder={editando ? "Sin cambios" : "Contraseña de acceso"}
                        autoComplete="new-password" aria-invalid={Boolean(errores.password)} />
                    <button type="button" className={styles.botonOjo} onClick={() => cambiarUI("verPassword", !ui.verPassword)}
                        aria-label={ui.verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                        {ui.verPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </Campo>

            <fieldset className={styles.grupoEstado}>
                <legend className={styles.etiqueta}>Estado</legend>
                <div className={styles.estados}>
                    {ESTADOS.map((estado) => {
                        const activo = valores.estado === estado.valor;
                        return (
                            <label key={estado.valor} className={`${styles.estadoOpcion} ${styles[estado.valor]} ${activo ? styles.estadoSeleccionado : ""}`}>
                                <input type="radio" name={`${id}-estado`} value={estado.valor} checked={activo}
                                    onChange={() => cambiar("estado", estado.valor)} className={styles.radioOculto} />
                                <span className={styles.estadoPunto} aria-hidden="true" />
                                <span className={styles.estadoTexto}>
                                    <strong>{estado.etiqueta}</strong>
                                    <small>{estado.descripcion}</small>
                                </span>
                                <span className={styles.estadoCheck} aria-hidden="true">{activo && <FaCheck />}</span>
                            </label>
                        );
                    })}
                </div>
            </fieldset>

            <div className={styles.gridDos}>
                <Campo etiqueta="Porcentaje de comisiones" htmlFor={`${id}-comisiones`} error={errores.comisiones} requerido>
                    <div className={styles.comisionContenedor}>
                        <input className={styles.controlRango} type="range" min="0" max="100" step="1"
                            value={Number(valores.comisiones) || 0} onChange={(e) => cambiar("comisiones", e.target.value)}
                            aria-label="Porcentaje de comisiones" style={{ "--progreso": `${Number(valores.comisiones) || 0}%` }} />
                        <div className={styles.comisionNumero}>
                            <input id={`${id}-comisiones`} className={`${styles.input} ${styles.inputComision} ${errores.comisiones ? styles.inputError : ""}`}
                                type="number" min="0" max="100" step="1" value={valores.comisiones}
                                onChange={(e) => cambiar("comisiones", e.target.value)} aria-invalid={Boolean(errores.comisiones)} />
                            <span aria-hidden="true">%</span>
                        </div>
                    </div>
                </Campo>

                <Campo etiqueta="Fecha de alta" ayuda={editando ? "La fecha de alta no se puede modificar." : "Se registra automáticamente al guardar."}>
                    <div className={styles.fechaAutomatica}>
                        <FaCalendarAlt aria-hidden="true" />
                        <span>{editando ? formatearFechaHora(empleado.fechaAlta) : "Automática al crear el empleado"}</span>
                    </div>
                </Campo>
            </div>

            <div className={styles.acciones}>
                {onCancelar && <button type="button" className={styles.botonCancelar} onClick={onCancelar}>Cancelar</button>}
                <button type="submit" className={styles.botonGuardar} disabled={ui.procesando}>
                    {textoGuardar || (editando ? "Guardar cambios" : "Crear empleado")}
                </button>
            </div>
        </form>
    );
}
