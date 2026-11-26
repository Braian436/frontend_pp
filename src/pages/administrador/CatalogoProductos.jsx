import { useCallback, useEffect, useState } from "react";
import { crearCatalogoApi, editarCatalogoApi, eliminarCatalogoApi, listarCatalogoApi } from "../../api/productosApi.js";
import CardProducto from "../../components/cardProducto/CardProducto";
import AdminCatalogModal from "../../components/adminCatalogModal/AdminCatalogModal";
import styles from "./Administrador.module.css";
import { extraerFilas } from "./adminCrud";

const CONFIGS = {
    marcas: {
        titulo: "Marcas",
        boton: "+ Nueva Marca",
        pk: "id_marca",
        campos: [{ name: "nombre", label: "Nombre", required: true, value: "" }],
        payload: (b) => ({ nombre: b.nombre.trim() }),
        tarjeta: (x) => ({ nombre: x.nombre, descripcion: `Marca #${x.id_marca}` }),
    },
    categorias: {
        titulo: "Categorías",
        boton: "+ Nueva Categoría",
        pk: "id_categoria",
        conEstado: true,
        campos: [
            { name: "nombre", label: "Nombre", required: true, value: "" },
            { name: "descripcion", label: "Descripción", value: "" },
            { name: "estado", label: "Estado", options: [{ value: "true", label: "Activo" }, { value: "false", label: "Inactivo" }], value: "true" },
        ],
        payload: (b) => ({ nombre: b.nombre.trim(), descripcion: b.descripcion?.trim() ?? "", estado: b.estado === "true" || b.estado === true }),
        tarjeta: (x) => ({ nombre: x.nombre, descripcion: x.descripcion || "Sin descripción", estado: x.estado }),
    },
    descuentos: {
        titulo: "Descuentos",
        boton: "+ Nuevo Descuento",
        pk: "id_descuento",
        campos: [
            { name: "nombre", label: "Nombre", required: true, value: "" },
            { name: "mayorista", label: "Tipo", options: [{ value: "false", label: "Minorista" }, { value: "true", label: "Mayorista" }], value: "false" },
            { name: "cantidad", label: "Cantidad", type: "number", min: 0, step: "0.01", required: true, value: "" },
        ],
        payload: (b) => ({ nombre: b.nombre.trim(), mayorista: b.mayorista === "true" || b.mayorista === true, cantidad: Number(b.cantidad) }),
        tarjeta: (x) => ({ nombre: x.nombre, descripcion: x.mayorista ? "Mayorista" : "Minorista", precios: [["Cantidad", x.cantidad]] }),
    },
};

export default function CatalogoProductos({ tipo }) {
    const cfg = CONFIGS[tipo];
    const [items, setItems] = useState([]);
    const [actual, setActual] = useState(null);
    const [abierto, setAbierto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const cargar = useCallback(async (signal) => {
        try {
            setItems(extraerFilas(await listarCatalogoApi(tipo, signal)));
            setError("");
        } catch (fallo) {
            if (fallo.name !== "AbortError") setError(fallo.message);
        } finally {
            setLoading(false);
        }
    }, [tipo]);

    useEffect(() => {
        const controller = new AbortController();
        listarCatalogoApi(tipo, controller.signal).then((resp) => {
            setItems(extraerFilas(resp));
            setError("");
        }).catch((fallo) => {
            if (fallo.name !== "AbortError") setError(fallo.message);
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, [tipo]);

    const guardar = async (body) => {
        setSaving(true);
        setError("");
        try {
            const payload = cfg.payload(body);
            if (actual) await editarCatalogoApi(tipo, actual[cfg.pk], payload);
            else await crearCatalogoApi(tipo, payload);
            setAbierto(false);
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setSaving(false);
        }
    };

    const eliminar = async (item) => {
        if (!window.confirm(`¿Eliminar ${item.nombre}?`)) return;
        setLoading(true);
        try {
            await eliminarCatalogoApi(tipo, item[cfg.pk]);
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
            setLoading(false);
        }
    };

    const cambiarEstado = async (item, estado) => {
        setLoading(true);
        try {
            await editarCatalogoApi(tipo, item[cfg.pk], { estado });
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
            setLoading(false);
        }
    };

    return (
        <section className={`container-fluid py-4 text-white ${styles.pagina}`}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <p className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</p>
                        <h1 className={styles.titulo}>{cfg.titulo}</h1>
                    </div>
                    <button className={`btn ${styles.botonNuevo}`} onClick={() => { setActual(null); setError(""); setAbierto(true); }}>
                        {cfg.boton}
                    </button>
                </div>
                {loading && <p className="text-secondary text-center py-4">Cargando {cfg.titulo.toLowerCase()}...</p>}
                {error && !abierto && <p className="text-danger text-center" role="alert">{error}</p>}
                <div className="row g-4">
                    {items.map((item) => (
                        <div className="col-12 col-md-6 col-lg-4" key={item[cfg.pk]}>
                            <CardProducto
                                tarjeta={cfg.tarjeta(item)}
                                onEditar={() => { setActual(item); setError(""); setAbierto(true); }}
                                onEliminar={() => eliminar(item)}
                                onCambioEstado={cfg.conEstado ? (estado) => cambiarEstado(item, estado) : undefined}
                            />
                        </div>
                    ))}
                </div>
                {!loading && !items.length && <p className="text-center text-secondary py-5">No hay {cfg.titulo.toLowerCase()}.</p>}
            </div>
            {abierto && (
                <AdminCatalogModal
                    titulo={actual ? `Editar ${cfg.titulo.slice(0, -1).toLowerCase()}` : cfg.boton.replace("+ ", "")}
                    item={actual}
                    campos={cfg.campos}
                    guardar={guardar}
                    cerrar={() => setAbierto(false)}
                    saving={saving}
                    error={error}
                />
            )}
        </section>
    );
}
