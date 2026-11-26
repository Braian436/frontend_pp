import { useCallback, useEffect, useState } from "react";
import { crearClienteApi, editarClienteApi, eliminarClienteApi, listarClientesApi } from "../../api/clientesApi.js";
import AdminCatalogModal from "../../components/adminCatalogModal/AdminCatalogModal";
import styles from "./Administrador.module.css";
import { extraerFilas } from "./adminCrud";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cliente, setCliente] = useState(null);
    const [abierto, setAbierto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const cargar = useCallback(async (signal) => {
        try {
            const resp = await listarClientesApi(signal);
            setClientes(extraerFilas(resp, "clientes"));
            setError("");
        } catch (fallo) {
            if (fallo.name !== "AbortError") setError(fallo.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        listarClientesApi(controller.signal).then((resp) => {
            setClientes(extraerFilas(resp, "clientes"));
            setError("");
        }).catch((fallo) => {
            if (fallo.name !== "AbortError") setError(fallo.message);
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, []);

    const texto = busqueda.toLowerCase().trim();
    const clientesFiltrados = clientes.filter((c) => {
        if (!texto) return true;
        const nombre = String(c.nombre ?? "").toLowerCase();
        const apellido = String(c.apellido ?? "").toLowerCase();
        const telefono = String(c.telefono ?? "").toLowerCase();
        return nombre.includes(texto) || apellido.includes(texto) || `${nombre} ${apellido}`.includes(texto) || telefono.includes(texto);
    });

    const campos = [
        { name: "nombre", label: "Nombre", required: true, value: "" },
        { name: "apellido", label: "Apellido", required: true, value: "" },
        { name: "telefono", label: "Teléfono", required: true, value: "" },
        { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", value: "" },
    ];

    const guardar = async (body) => {
        setSaving(true);
        setError("");
        try {
            const payload = {
                nombre: body.nombre.trim(),
                apellido: body.apellido.trim(),
                telefono: body.telefono.trim(),
                fecha_nacimiento: body.fecha_nacimiento || null,
            };
            if (cliente) await editarClienteApi(cliente.id_cliente, payload);
            else await crearClienteApi(payload);
            setAbierto(false);
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setSaving(false);
        }
    };

    const eliminar = async (item) => {
        if (!window.confirm(`¿Seguro que querés eliminar a ${item.nombre} ${item.apellido}?`)) return;
        setLoading(true);
        try {
            await eliminarClienteApi(item.id_cliente);
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
            setLoading(false);
        }
    };

    return (
        <section className={`min-vh-100 py-3 pb-5 ${styles.pagina}`}>
            <div className="container">
                <div className="row align-items-center g-3 mb-4">
                    <div className="col-12 col-md-8">
                        <span className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</span>
                        <h1 className={styles.titulo}>Clientes</h1>
                    </div>
                    <div className="col-12 col-md-4 text-md-end">
                        <button type="button" className={`btn ${styles.botonNuevo}`} onClick={() => { setCliente(null); setError(""); setAbierto(true); }}>
                            + Nuevo cliente
                        </button>
                    </div>
                </div>

                <div className={styles.filtros}>
                    <input
                        type="search"
                        className={`form-control ${styles.buscador}`}
                        placeholder="Buscar por nombre, apellido o teléfono..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar clientes"
                    />
                </div>

                {loading && <p className="text-secondary text-center py-4" role="status">Cargando clientes...</p>}
                {error && !abierto && <p className="text-danger text-center py-2" role="alert">{error}</p>}

                <p className={styles.cantidad}>{clientesFiltrados.length} CLIENTES</p>

                <div className="row g-4">
                    {clientesFiltrados.map((item) => {
                        const nombreCompleto = `${item.nombre ?? ""} ${item.apellido ?? ""}`.trim();
                        const iniciales = nombreCompleto.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
                        return (
                            <div key={item.id_cliente} className="col-12 col-md-6 col-lg-4">
                                <div className={`card h-100 ${styles.card}`}>
                                    <div className={styles.portada}>
                                        <div className={styles.avatar}><span>{iniciales}</span></div>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className={styles.nombre}>{nombreCompleto}</h5>
                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <div className={styles.dato}>
                                                    <small>TELÉFONO</small>
                                                    <strong>{item.telefono}</strong>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className={styles.dato}>
                                                    <small>NACIMIENTO</small>
                                                    <strong>{item.fecha_nacimiento || "Sin definir"}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 mt-auto">
                                            <button type="button" className={`btn flex-fill ${styles.botonEditar}`} onClick={() => { setCliente(item); setError(""); setAbierto(true); }}>
                                                Editar
                                            </button>
                                            <button type="button" className={`btn flex-fill ${styles.botonEliminar}`} onClick={() => eliminar(item)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!loading && !clientesFiltrados.length && <p className="text-center text-secondary py-5">No hay clientes para mostrar.</p>}
            </div>

            {abierto && (
                <AdminCatalogModal
                    titulo={cliente ? "Editar cliente" : "Nuevo cliente"}
                    item={cliente}
                    campos={campos}
                    guardar={guardar}
                    cerrar={() => setAbierto(false)}
                    saving={saving}
                    error={error}
                />
            )}
        </section>
    );
}
