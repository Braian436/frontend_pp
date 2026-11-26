import { useCallback, useEffect, useState } from "react";
import { cargarDatosProductos, crearProductoApi, editarProductoApi, eliminarProductoApi } from "../../api/productosApi.js";
import CardProducto from "../../components/cardProducto/CardProducto";
import AdminCatalogModal from "../../components/adminCatalogModal/AdminCatalogModal";
import styles from "./Administrador.module.css";
import { construirProducto } from "./adminCrud";

export default function GestionProductos() {
    const [datos, setDatos] = useState({ productos: [], marcas: [], categorias: [], descuentos: [], precios: [] });
    const [producto, setProducto] = useState(null);
    const [abierto, setAbierto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const cargar = useCallback(async () => {
        try {
            const respuesta = await cargarDatosProductos();
            setDatos(respuesta);
            setError("");
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarDatosProductos().then((respuesta) => {
            setDatos(respuesta);
            setError("");
        }).catch((fallo) => {
            setError(fallo.message);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const precios = new Map(datos.precios.map((item) => [item.id_producto, item]));
    const productos = datos.productos.map((item) => ({
        ...item,
        ...precios.get(item.id_producto),
    }));
    const campos = [
        { name: "nombre", label: "Nombre", required: true, value: "" },
        { name: "descripcion", label: "Descripción", value: "" },
        { name: "stock_actual", label: "Stock actual", type: "number", min: 0, required: true, value: "" },
        { name: "stock_minimo", label: "Stock mínimo", type: "number", min: 0, value: "" },
        { name: "estado", label: "Estado", options: [{ value: "true", label: "Activo" }, { value: "false", label: "Inactivo" }], value: "true" },
        { name: "id_marca", label: "Marca", required: true, options: datos.marcas.map(({ id_marca, nombre }) => ({ value: String(id_marca), label: nombre })), value: "" },
        { name: "id_categoria", label: "Categoría", required: true, options: datos.categorias.map(({ id_categoria, nombre }) => ({ value: String(id_categoria), label: nombre })), value: "" },
        { name: "id_descuento", label: "Descuento", required: true, options: datos.descuentos.map(({ id_descuento, nombre, mayorista, cantidad }) => ({ value: String(id_descuento), label: `${nombre} · ${mayorista ? "Mayorista" : "Minorista"} · ${cantidad ?? "Sin cantidad"}` })), value: "" },
    ];
    const guardar = async (body) => {
        const payload = construirProducto(body);
        setSaving(true);
        setError("");
        try {
            if (producto) await editarProductoApi(producto.id_producto, payload);
            else await crearProductoApi(payload);
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
            await eliminarProductoApi(item.id_producto);
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setLoading(false);
        }
    };
    const cambiarEstado = async (item, estado) => {
        setLoading(true);
        try {
            await editarProductoApi(item.id_producto, { estado });
            await cargar();
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={`container-fluid py-4 text-white ${styles.pagina}`}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <p className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</p>
                        <h1 className={styles.titulo}>Productos</h1>
                    </div>
                    <button className={`btn ${styles.botonNuevo}`} onClick={() => { setProducto(null); setAbierto(true); }}>
                        + Nuevo Producto
                    </button>
                </div>
                {loading && <p className="text-secondary text-center py-4">Cargando productos...</p>}
                {error && <p className="text-danger text-center" role="alert">{error}</p>}
                <div className="row g-4">
                    {productos.map((prod) => (
                        <div className="col-12 col-md-6 col-lg-4" key={prod.id_producto}>
                            <CardProducto
                                producto={prod}
                                onEditar={() => { setProducto(prod); setAbierto(true); }}
                                onEliminar={() => eliminar(prod)}
                                onCambioEstado={(estado) => cambiarEstado(prod, estado)}
                            />
                        </div>
                    ))}
                </div>
                {!loading && !productos.length && <p className="text-center text-secondary py-5">No hay productos.</p>}
            </div>
            {abierto && <AdminCatalogModal titulo={producto ? "Editar producto" : "Nuevo producto"} item={producto} campos={campos} guardar={guardar} cerrar={() => setAbierto(false)} saving={saving} error={error} />}
        </section>
    );
}