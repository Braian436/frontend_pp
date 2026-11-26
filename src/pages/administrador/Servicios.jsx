import { useCallback, useEffect, useState } from "react";
import { asignarBarberoServicioApi, cargarDatosServicios, crearServicioApi, editarServicioApi, eliminarServicioApi, quitarBarberoServicioApi } from "../../api/serviciosApi.js";
import CardProducto from "../../components/cardProducto/CardProducto";
import CardServicio from "../../components/cardServicio/CardServicio";
import AdminCatalogModal from "../../components/adminCatalogModal/AdminCatalogModal";
import fondo from "../../assets/fondoservicio1.jpg";
import styles from "./Administrador.module.css";
import { construirServicio, extraerFilas } from "./adminCrud";

export default function Servicios({ administracion = false }) {
    const [datos, setDatos] = useState({ servicios: [], barberos: [], asignaciones: [] });
    const [servicio, setServicio] = useState(null);
    const [abierto, setAbierto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const cargar = useCallback(async (signal) => {
        try {
            const resp = await cargarDatosServicios(signal);
            setDatos({
                servicios: extraerFilas(resp.servicios, "servicios"),
                barberos: extraerFilas(resp.barberos),
                asignaciones: extraerFilas(resp.asignaciones),
            });
            setError("");
        } catch (fallo) {
            if (fallo.name !== "AbortError") setError(fallo.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        cargarDatosServicios(controller.signal).then((resp) => {
            setDatos({
                servicios: extraerFilas(resp.servicios, "servicios"),
                barberos: extraerFilas(resp.barberos),
                asignaciones: extraerFilas(resp.asignaciones),
            });
            setError("");
        }).catch((fallo) => {
            if (fallo.name !== "AbortError") setError(fallo.message);
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, []);

    const listaBarberos = datos.barberos.map((b) => ({
        id: String(b.id_empleado ?? b.id),
        nombre: `${b.nombre ?? ""} ${b.apellido ?? ""}`.trim(),
    }));
    const nombresBarberos = new Map(listaBarberos.map((b) => [b.id, b.nombre]));

    const servicios = datos.servicios.map((item) => {
        const asigs = datos.asignaciones.filter((a) => String(a.id_servicio) === String(item.id_servicio));
        const asignadosIds = new Set(asigs.map((a) => String(a.id_empleado)));
        return {
            ...item,
            barberosIds: [...asignadosIds],
            barberos: asigs.map((a) => ({
                id_empleado_servicio: a.id_empleado_servicio,
                id_empleado: String(a.id_empleado),
                nombre: nombresBarberos.get(String(a.id_empleado)) ?? `Barbero #${a.id_empleado}`,
            })),
            barberosDisponibles: listaBarberos.filter((b) => !asignadosIds.has(b.id)),
        };
    });

    const campos = [
        { name: "nombre", label: "Nombre", required: true, value: "" },
        { name: "descripcion", label: "Descripción", value: "" },
        { name: "precio", label: "Precio", type: "number", min: 0, step: "0.01", required: true, value: "" },
        {
            name: "barberosIds",
            label: "Barberos que realizan el servicio",
            multiple: true,
            options: listaBarberos.map((b) => ({ value: b.id, label: b.nombre })),
            value: [],
        },
    ];

    const guardar = async (body) => {
        setSaving(true);
        setError("");
        try {
            const payload = construirServicio(body);
            const guardado = servicio
                ? await editarServicioApi(servicio.id_servicio, payload)
                : await crearServicioApi(payload);
            const idServicio = servicio?.id_servicio ?? guardado?.id_servicio;
            const seleccionados = new Set((body.barberosIds ?? []).map(String));
            const actuales = datos.asignaciones.filter((a) => String(a.id_servicio) === String(idServicio));

            await Promise.all([
                ...actuales.filter((a) => !seleccionados.has(String(a.id_empleado))).map((a) => quitarBarberoServicioApi(a.id_empleado_servicio)),
                ...[...seleccionados].filter((idEmp) => !actuales.some((a) => String(a.id_empleado) === idEmp)).map((idEmp) =>
                    asignarBarberoServicioApi({ id_empleado: Number(idEmp), id_servicio: Number(idServicio), descripcion: "" })
                ),
            ]);
            setAbierto(false);
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setSaving(false);
        }
    };

    const agregarBarbero = async (idServicio, idEmpleado) => {
        try {
            await asignarBarberoServicioApi({ id_empleado: Number(idEmpleado), id_servicio: Number(idServicio), descripcion: "" });
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
        }
    };

    const eliminar = async (item) => {
        if (!window.confirm(`¿Eliminar ${item.nombre}?`)) return;
        setLoading(true);
        try {
            await eliminarServicioApi(item.id_servicio);
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
            setLoading(false);
        }
    };

    const contenido = administracion ? (
        <div className="row g-4">
            {servicios.map((item) => (
                <div className="col-12 col-md-6 col-lg-4" key={item.id_servicio}>
                    <CardProducto
                        servicio={item}
                        onEditar={() => { setServicio(item); setAbierto(true); }}
                        onEliminar={() => eliminar(item)}
                        onAgregarBarbero={(idEmp) => agregarBarbero(item.id_servicio, idEmp)}
                    />
                </div>
            ))}
        </div>
    ) : (
        <div className="d-flex flex-column gap-4">
            {servicios.map((item) => (
                <CardServicio
                    key={item.id_servicio}
                    nombre={item.nombre}
                    descripcion={item.descripcion}
                    precio={item.precio}
                    barberos={item.barberos}
                />
            ))}
        </div>
    );

    if (!administracion) {
        return (
            <section
                className="container-fluid py-5 text-white"
                style={{
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    backgroundBlendMode: "overlay",
                }}
            >
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="fw-bold" style={{ color: "#D9C493", letterSpacing: "2px" }}>DESTACADOS</h1>
                    </div>
                    {loading && <p className={`text-center ${styles.estado}`}>Cargando servicios...</p>}
                    {error && <p className={`text-center ${styles.error}`} role="alert">{error}</p>}
                    {contenido}
                    {!loading && !servicios.length && <p className={`text-center py-5 ${styles.estado}`}>No hay servicios.</p>}
                </div>
            </section>
        );
    }

    return (
        <section className={`container-fluid py-4 text-white ${styles.pagina}`}>
            <div className="container">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <p className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</p>
                        <h1 className={styles.titulo}>Servicios</h1>
                    </div>
                    <button className={`btn ${styles.botonNuevo}`} onClick={() => { setServicio(null); setAbierto(true); }}>
                        + Nuevo Servicio
                    </button>
                </div>
                {loading && <p className={`text-center py-4 ${styles.estado}`}>Cargando servicios...</p>}
                {error && !abierto && <p className={`text-center ${styles.error}`} role="alert">{error}</p>}
                {contenido}
                {!loading && !servicios.length && <p className={`text-center py-5 ${styles.estado}`}>No hay servicios.</p>}
            </div>

            {abierto && (
                <AdminCatalogModal
                    titulo={servicio ? "Editar servicio" : "Nuevo servicio"}
                    item={servicio}
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
