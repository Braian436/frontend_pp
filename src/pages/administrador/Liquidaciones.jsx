import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest.js";
import {
    calcularLiquidacionApi,
    crearLiquidacionApi,
    editarLiquidacionApi,
    eliminarLiquidacionApi,
    listarLiquidacionesApi,
} from "../../api/liquidacionesApi.js";
import { extraerFilas, obtenerId } from "./adminCrud.js";
import styles from "./Administrador.module.css";
import modalStyles from "../../components/adminCatalogModal/AdminCatalogModal.module.css";

const vacio = () => {
    const hoy = new Date();
    const fin = new Date(hoy);
    const dia = fin.getDay();
    const diffLunes = (dia + 6) % 7;
    fin.setDate(fin.getDate() - diffLunes - 1);
    const inicio = new Date(fin);
    inicio.setDate(fin.getDate() - 6);
    const fmt = (d) => d.toISOString().slice(0, 10);
    return {
        id_empleado: "",
        fecha_inicio: fmt(inicio),
        fecha_fin: fmt(fin),
        total_comision: "",
        total_a_pagar: "",
        estado: "false",
    };
};

const aInputDate = (valor) => {
    if (!valor) return "";
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) return String(valor).slice(0, 10);
    return d.toISOString().slice(0, 10);
};

export default function Liquidaciones() {
    const [items, setItems] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [abierto, setAbierto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState(vacio());
    const [calc, setCalc] = useState(null);

    const cargar = useCallback(async (signal) => {
        setLoading(true);
        setError("");
        try {
            const [liq, emps] = await Promise.all([
                listarLiquidacionesApi(signal),
                apiRequest("/empleados/", signal ? { signal } : undefined),
            ]);
            setItems(extraerFilas(liq, "liquidaciones"));
            setEmpleados(extraerFilas(emps, "empleados"));
        } catch (e) {
            if (e.name !== "AbortError") setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const c = new AbortController();
        cargar(c.signal);
        return () => c.abort();
    }, [cargar]);

    const abrirNuevo = () => {
        setEditando(null);
        setForm(vacio());
        setCalc(null);
        setError("");
        setAbierto(true);
    };
    const abrirEditar = (item) => {
        setEditando(item);
        setCalc(null);
        setError("");
        setForm({
            id_empleado: String(item.id_empleado ?? ""),
            fecha_inicio: aInputDate(item.fecha_inicio),
            fecha_fin: aInputDate(item.fecha_fin),
            total_comision: String(item.total_comision ?? ""),
            total_a_pagar: String(item.total_a_pagar ?? ""),
            estado: item.estado ? "true" : "false",
        });
        setAbierto(true);
    };

    const calcular = async () => {
        if (!form.id_empleado || !form.fecha_inicio || !form.fecha_fin) {
            setError("Seleccioná empleado y periodo para calcular.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const r = await calcularLiquidacionApi({
                id_empleado: Number(form.id_empleado),
                fecha_inicio: form.fecha_inicio,
                fecha_fin: form.fecha_fin,
            });
            setCalc(r);
            setForm((f) => ({
                ...f,
                total_comision: String(r.total_comision ?? f.total_comision),
                total_a_pagar: String(r.total_a_pagar ?? f.total_a_pagar),
            }));
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const guardar = async (e) => {
        e.preventDefault();
        if (!form.id_empleado || !form.fecha_inicio || !form.fecha_fin) {
            setError("Completá empleado y periodo.");
            return;
        }
        setSaving(true);
        setError("");
        const payload = {
            id_empleado: Number(form.id_empleado),
            fecha_inicio: new Date(form.fecha_inicio + "T00:00:00").toISOString(),
            fecha_fin: new Date(form.fecha_fin + "T23:59:59").toISOString(),
            total_comision: Number(form.total_comision || 0),
            total_a_pagar: Number(form.total_a_pagar || 0),
            estado: form.estado === "true",
        };
        try {
            const id = obtenerId(editando);
            if (id) await editarLiquidacionApi(id, payload);
            else await crearLiquidacionApi(payload);
            setAbierto(false);
            await cargar();
        } catch (e2) {
            setError(e2.message);
        } finally {
            setSaving(false);
        }
    };

    const eliminar = async (item) => {
        const nombre = `${item.empleado_nombre ?? ""} ${item.empleado_apellido ?? ""}`.trim();
        if (!window.confirm(`¿Eliminar liquidación de ${nombre || "empleado"}?`)) return;
        setLoading(true);
        try {
            await eliminarLiquidacionApi(obtenerId(item));
            await cargar();
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    const nombreEmpleado = (item) =>
        `${item.empleado_nombre ?? ""} ${item.empleado_apellido ?? ""}`.trim() || `Empleado #${item.id_empleado}`;

    return (
        <section className={`container-fluid py-4 text-white ${styles.pagina}`}>
            <div className="container">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <p className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</p>
                        <h1 className={styles.titulo}>Liquidaciones</h1>
                    </div>
                    <button className={`btn ${styles.botonNuevo}`} onClick={abrirNuevo}>+ Nueva liquidación</button>
                </div>
                {loading && <p className="text-center py-4">Cargando liquidaciones...</p>}
                {error && !abierto && <p className="text-danger text-center" role="alert">{error}</p>}
                <div className="row g-4">
                    {items.map((item) => (
                        <div className="col-12 col-md-6 col-lg-4" key={obtenerId(item)}>
                            <div className={`card h-100 ${styles.tarjetaOscura}`}>
                                <div className="card-body d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between align-items-start gap-2">
                                        <h2 className="h5 mb-0">{nombreEmpleado(item)}</h2>
                                        <span className={`badge ${item.estado ? "text-bg-success" : "text-bg-warning"}`}>
                                            {item.estado ? "Pagada" : "Pendiente"}
                                        </span>
                                    </div>
                                    <div className="small text-secondary">
                                        {aInputDate(item.fecha_inicio)} al {aInputDate(item.fecha_fin)}
                                    </div>
                                    <div>Comisión: <strong>${Number(item.total_comision ?? 0).toFixed(2)}</strong></div>
                                    <div>A pagar: <strong>${Number(item.total_a_pagar ?? 0).toFixed(2)}</strong></div>
                                    <div className="mt-auto d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-light" onClick={() => abrirEditar(item)}>Editar</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(item)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && !items.length && <p className="text-center py-5 text-secondary">No hay liquidaciones.</p>}
            </div>

            {abierto && (
                <div className={modalStyles.overlay} role="dialog" aria-modal="true">
                    <div className={`modal show d-block ${modalStyles.modal}`}>
                        <div className={`modal-dialog modal-dialog-centered ${modalStyles.dialogo}`}>
                            <form className={`modal-content ${modalStyles.contenido}`} onSubmit={guardar}>
                                <div className={`modal-header ${modalStyles.header}`}>
                                    <h2 className="modal-title fs-5">{editando ? "Editar liquidación" : "Nueva liquidación"}</h2>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setAbierto(false)} aria-label="Cerrar" />
                                </div>
                                <div className={`modal-body scrollbar-app ${modalStyles.cuerpo}`}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="liq-empleado">Empleado</label>
                                        <select id="liq-empleado" className={`form-select ${modalStyles.input}`} value={form.id_empleado} onChange={(e) => setForm({ ...form, id_empleado: e.target.value })} required>
                                            <option value="">Seleccionar...</option>
                                            {empleados.map((emp) => (
                                                <option key={obtenerId(emp)} value={obtenerId(emp)}>
                                                    {emp.nombre} {emp.apellido} ({emp.porcentaje_comision}%)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="liq-inicio">Fecha inicio</label>
                                            <input id="liq-inicio" type="date" className={`form-control ${modalStyles.input}`} value={form.fecha_inicio} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="liq-fin">Fecha fin</label>
                                            <input id="liq-fin" type="date" className={`form-control ${modalStyles.input}`} value={form.fecha_fin} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <button type="button" className="btn btn-outline-light btn-sm" onClick={calcular} disabled={saving}>Calcular comisión</button>
                                        {calc && <div className="small text-secondary mt-2">Servicios: {calc.cantidad_servicios} | Base: ${calc.base} | Comisión: ${calc.total_comision}</div>}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="liq-comision">Total comisión</label>
                                            <input id="liq-comision" type="number" min="0" step="0.01" className={`form-control ${modalStyles.input}`} value={form.total_comision} onChange={(e) => setForm({ ...form, total_comision: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="liq-pagar">Total a pagar</label>
                                            <input id="liq-pagar" type="number" min="0" step="0.01" className={`form-control ${modalStyles.input}`} value={form.total_a_pagar} onChange={(e) => setForm({ ...form, total_a_pagar: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="liq-estado">Estado</label>
                                        <select id="liq-estado" className={`form-select ${modalStyles.input}`} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                                            <option value="false">Pendiente</option>
                                            <option value="true">Pagada</option>
                                        </select>
                                    </div>
                                    {error && <p className={modalStyles.error} role="alert">{error}</p>}
                                </div>
                                <div className={`modal-footer ${modalStyles.footer}`}>
                                    <button type="button" className={`btn ${modalStyles.cancelar}`} onClick={() => setAbierto(false)}>Cancelar</button>
                                    <button type="submit" className={`btn ${modalStyles.guardar}`} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}