import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { apiRequest } from "../../api/apiRequest.js";
import fondo from "../../assets/facha1.png";
import logo from "../../assets/logo_barber.png";
import { HORAS_POR_PAGINA, diasSinDomingo, horasReservables } from "./horariosDisponibles.js";
import styles from "./TurnosDisponibles.module.css";

const horas = Array.from({ length: 13 }, (_, i) => `${String(i + 10).padStart(2, "0")}:00`);
const campos = [["nombre", "NOMBRE"], ["apellido", "APELLIDO"], ["telefono", "TEL/CELULAR"], ["correo", "CORREO ELECTRONICO"]];
const formularioInicial = { nombre: "", apellido: "", telefono: "", correo: "" };
const fechaLocal = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

export default function TurnosDisponibles() {
    const request = apiRequest;
    const [params] = useSearchParams();
    const [inicio, setInicio] = useState(() => { const hoy = new Date(); hoy.setHours(12, 0, 0, 0); return hoy; });
    const [ahora, setAhora] = useState(() => new Date());
    const [seleccion, setSeleccion] = useState(null);
    const [indices, setIndices] = useState({});
    const [formAbierto, setFormAbierto] = useState(false);
    const [confirmado, setConfirmado] = useState(false);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [disponibilidad, setDisponibilidad] = useState({});
    const [cargando, setCargando] = useState(true);
    const [errorDisponibilidad, setErrorDisponibilidad] = useState("");
    const [errorReserva, setErrorReserva] = useState("");
    const [reservando, setReservando] = useState(false);
    const [actualizar, setActualizar] = useState(0);
    const empleado = params.get("barbero");
    const barbero = params.get("nombre") || "Barbero";

    const dias = useMemo(() => diasSinDomingo(inicio).map((fecha) => ({
        fecha,
        clave: fechaLocal(fecha),
        nombre: new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(fecha),
        corta: new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "numeric" }).format(fecha),
        completa: new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(fecha),
    })), [inicio]);

    // Sólo se renderizan horarios libres y con margen suficiente.
    const horasPorDia = useMemo(
        () => Object.fromEntries(dias.map((dia) => [
            dia.clave,
            horasReservables({ dia: dia.clave, horas, disponibilidad, ahora }),
        ])),
        [dias, disponibilidad, ahora]
    );

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            setCargando(true); setErrorDisponibilidad(""); setDisponibilidad({});
            if (!empleado) { setErrorDisponibilidad("No se encontró el empleado seleccionado."); setCargando(false); return; }
            const consulta = new URLSearchParams({
                empleado,
                desde: fechaLocal(dias[0].fecha),
                hasta: fechaLocal(dias[dias.length - 1].fecha),
            });
            horas.forEach((hora) => consulta.append("horas", hora));
            try {
                const { slots } = await request(`/turnos/disponibilidad/?${consulta}`, { signal: controller.signal });
                if (!Array.isArray(slots)) throw new Error("Respuesta de disponibilidad inválida.");
                setDisponibilidad(Object.fromEntries(slots.map(({ fecha, hora, disponible }) => [`${fecha}T${String(hora).slice(0, 5)}`, disponible])));
            } catch (error) {
                if (error.name !== "AbortError") setErrorDisponibilidad(error.message);
            } finally { if (!controller.signal.aborted) setCargando(false); }
        };
        cargar();
        return () => controller.abort();
    }, [empleado, inicio, actualizar, request, dias]);

    useEffect(() => {
        if (!confirmado) return;
        const timer = setTimeout(() => { setConfirmado(false); setFormAbierto(false); setSeleccion(null); setFormulario(formularioInicial); }, 5000);
        return () => clearTimeout(timer);
    }, [confirmado]);

    // Con la página abierta, un horario que cruza el margen deja de mostrarse.
    useEffect(() => {
        const timer = setInterval(() => setAhora(new Date()), 60_000);
        return () => clearInterval(timer);
    }, []);

    const seleccionValida = Boolean(seleccion)
        && (horasPorDia[seleccion.clave] ?? []).includes(seleccion.hora);

    const moverSemana = (cantidad) => {
        const nueva = new Date(inicio); nueva.setDate(nueva.getDate() + cantidad * 7);
        if (fechaLocal(nueva) < fechaLocal(new Date())) return;
        setInicio(nueva); setSeleccion(null); setFormAbierto(false); setErrorReserva("");
    };
    const moverHorarios = (clave, cantidad, total) => setIndices((prev) => ({
        ...prev,
        [clave]: Math.max(0, Math.min(Math.max(0, total - HORAS_POR_PAGINA), (prev[clave] || 0) + cantidad)),
    }));
    const cerrar = () => { setFormAbierto(false); setConfirmado(false); setErrorReserva(""); };
    const cambiarCampo = ({ target: { name, value } }) => setFormulario((prev) => ({ ...prev, [name]: value }));
    const confirmar = async (e) => {
        e.preventDefault(); if (!seleccion || reservando) return;
        if (!(horasPorDia[seleccion.clave] ?? []).includes(seleccion.hora)) {
            setErrorReserva("Ese horario ya no está disponible. Elegí otro.");
            setActualizar((n) => n + 1);
            return;
        }
        setReservando(true); setErrorReserva("");
        try {
            await request("/turnos/reservas/", {
                method: "POST",
                body: { empleado, fecha: fechaLocal(seleccion.fecha), hora: seleccion.hora, nombre: formulario.nombre, apellido: formulario.apellido, telefono: formulario.telefono, email: formulario.correo },
            });
            setActualizar((n) => n + 1); setConfirmado(true);
        } catch (error) {
            if (error.data?.error?.code === "hora_no_disponible") {
                setErrorReserva("Ese horario ya pasó o está a menos de 5 minutos. Elegí otro.");
                setActualizar((n) => n + 1);
            } else if (error.status === 409 || error.data?.error?.code === "slot_unavailable") {
                setErrorReserva("Ese horario ya no está disponible. Elegí otro.");
                setActualizar((n) => n + 1);
            } else {
                setErrorReserva(error.message);
            }
        }
        finally { setReservando(false); }
    };
    const semanaActual = fechaLocal(inicio) === fechaLocal(new Date());

    return (
        <section className={styles.seccion} style={{ "--fondo-turnos": `url(${fondo})` }}>
            <div className={`container ${styles.contenedor}`}>
                <header className={styles.encabezado}><h1 className="h4 mb-0 fw-bold">Horario semanal</h1></header>
                <p className={styles.aclaracion}>Sólo horarios disponibles, con al menos 5 minutos de anticipación.</p>
                <div className={`d-flex align-items-center justify-content-center gap-3 ${styles.navegacionSemana}`}>
                    <button className={`btn ${styles.botonNavegacion}`} onClick={() => moverSemana(-1)} disabled={semanaActual} aria-label="Semana anterior"><FaChevronLeft /></button>
                    <p className="mb-0 text-center">{new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" }).format(dias[0].fecha)}{" - "}{new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(dias[5].fecha)}</p>
                    <button className={`btn ${styles.botonNavegacion}`} onClick={() => moverSemana(1)} aria-label="Semana siguiente"><FaChevronRight /></button>
                </div>
                {errorDisponibilidad && <p role="alert" className="text-center text-warning">{errorDisponibilidad}</p>}
                {formAbierto && !seleccionValida && !confirmado && <p role="alert" className="text-center text-warning">Ese horario ya no está disponible. Elegí otro.</p>}
                <div className="d-flex flex-column gap-3">
                    {dias.map((dia) => {
                        const visibles = horasPorDia[dia.clave] ?? [];
                        const indice = Math.min(indices[dia.clave] || 0, Math.max(0, visibles.length - HORAS_POR_PAGINA));
                        const pagina = visibles.slice(indice, indice + HORAS_POR_PAGINA);
                        return (
                            <div className={`row g-3 align-items-center ${styles.filaDia}`} key={dia.clave}>
                                <div className="col-12 col-md-3 col-lg-2"><div className={`d-flex flex-column align-items-center justify-content-center ${styles.etiquetaDia}`}><span>{dia.nombre}</span><span>{dia.corta}</span></div></div>
                                <div className="col-12 col-md-9 col-lg-10"><div className={`d-flex align-items-center justify-content-center flex-wrap gap-2 ${styles.listaHorarios}`}>
                                    {visibles.length > HORAS_POR_PAGINA && <button className={`btn ${styles.botonNavegacion}`} onClick={() => moverHorarios(dia.clave, -1, visibles.length)} disabled={indice === 0} aria-label={`Horarios anteriores, ${dia.nombre}`}><FaChevronLeft /></button>}
                                    {cargando
                                        ? <span className={styles.cargandoDia} role="status" aria-label="Cargando horarios"><img src={logo} alt="" className={styles.logoCargando} /></span>
                                        : errorDisponibilidad
                                            ? null
                                            : visibles.length === 0
                                                ? <p className={styles.sinHorarios}>Sin horarios disponibles</p>
                                                : pagina.map((hora) => <button type="button" key={hora} className={`btn ${styles.botonHorario} ${seleccion?.clave === dia.clave && seleccion?.hora === hora ? styles.horarioSeleccionado : ""}`} onClick={() => { setSeleccion({ ...dia, hora }); setErrorReserva(""); setFormAbierto(true); }}>{hora}</button>)}
                                    {visibles.length > HORAS_POR_PAGINA && <button className={`btn ${styles.botonNavegacion}`} onClick={() => moverHorarios(dia.clave, 1, visibles.length)} disabled={indice >= visibles.length - HORAS_POR_PAGINA} aria-label={`Horarios siguientes, ${dia.nombre}`}><FaChevronRight /></button>}
                                </div></div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {formAbierto && seleccionValida && <div className={`modal show d-block ${styles.modalOverlay}`} role="dialog" aria-modal="true" aria-labelledby="tituloReserva">
                <div className={`modal-dialog modal-dialog-centered ${styles.modalDialog}`}>
                    <form className={`modal-content scrollbar-app ${styles.modalContent}`} onSubmit={confirmar}>
                        <div className="modal-header border-0 pb-2"><h2 id="tituloReserva" className="modal-title fs-6">Para confirmar tu turno completá los siguientes campos</h2><button type="button" className="btn-close btn-close-white" onClick={cerrar} aria-label="Cerrar" /></div>
                        <div className="modal-body pt-2">{campos.map(([name, label]) => <input key={name} className={`form-control mb-3 ${styles.campo}`} type={name === "correo" ? "email" : "text"} name={name} aria-label={label} placeholder={`${label}:`} value={formulario[name]} onChange={cambiarCampo} required />)}{errorReserva && <p role="alert" className="text-warning mb-0">{errorReserva}</p>}</div>
                        <div className="modal-footer border-0 justify-content-center pt-0"><button type="submit" className={`btn ${styles.botonConfirmar}`} disabled={reservando}>{reservando ? "ENVIANDO..." : "CONFIRMAR"}</button></div>
                    </form>
                </div>
            </div>}
            {confirmado && <div className={`modal show d-block ${styles.modalExito}`} role="dialog" aria-modal="true" aria-labelledby="tituloConfirmado">
                <div className={`modal-dialog modal-dialog-centered ${styles.dialogoExito}`}><div className={`modal-content ${styles.modalContent} p-3`}>
                    <h2 id="tituloConfirmado" className={`d-flex align-items-center justify-content-between fs-6 fw-bold ${styles.tituloExito}`}>TURNO CONFIRMADO <FaCheckCircle /></h2>
                    <p className="mb-2 fw-bold">{seleccion?.nombre} · {seleccion?.completa} · HS: {seleccion?.hora}</p>
                    <p className="mb-0">Barbero: <strong>{barbero}</strong></p>
                </div></div>
            </div>}
        </section>
    );
}
