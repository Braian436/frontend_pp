import { useState } from "react";
import CardProducto from "../../components/cardProducto/CardProducto";
import AdminCatalogModal from "../../components/adminCatalogModal/AdminCatalogModal";
import styles from "./Empleados.module.css";
import { construirProducto, normalizarActivo, obtenerId, obtenerTexto, useCrudApi } from "./adminCrud";

const normalizar = (item) => ({
    id: obtenerId(item),
    nombre: obtenerTexto(item, ["nombre", "name"]),
    descripcion: obtenerTexto(item, ["descripcion", "description"]),
    precio: obtenerTexto(item, ["precio", "price"], ""),
    activo: normalizarActivo(item?.activo ?? item?.active ?? item?.is_active ?? true),
});

export default function GestionProductos() {
    const crud = useCrudApi("/productos/", "productos");
    const [producto, setProducto] = useState(null);
    const [abierto, setAbierto] = useState(false);
    const productos = crud.items.map(normalizar);
    const campos = [
        { name: "nombre", label: "Nombre", required: true, value: "" },
        { name: "descripcion", label: "Descripción", value: "" },
        { name: "precio", label: "Precio", type: "number", min: 0, required: true, value: "" },
        { name: "activo", label: "Estado", options: ["true", "false"], value: "true" },
    ];
    const guardar = async (body) => {
        const payload = construirProducto(body);
        const ok = producto ? await crud.editar(producto, payload) : await crud.crear(payload);
        if (ok) setAbierto(false);
    };

    return (
        <section className={`container-fluid py-4 text-white ${styles.pagina}`}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <p className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</p>
                        <h1 className={styles.titulo}>Gestión de Productos</h1>
                    </div>
                    <button className={`btn ${styles.botonNuevo}`} onClick={() => { setProducto(null); setAbierto(true); }}>
                        + Nuevo Producto
                    </button>
                </div>
                {crud.loading && <p className="text-secondary text-center py-4">Cargando productos...</p>}
                {crud.error && <p className="text-danger text-center" role="alert">{crud.error}</p>}
                <div className="row g-4">
                    {productos.map((prod) => (
                        <div className="col-12 col-md-6 col-lg-4" key={prod.id}>
                            <CardProducto
                                nombre={prod.nombre}
                                descripcion={prod.descripcion}
                                precio={prod.precio}
                                activo={prod.activo}
                                onEditar={() => { setProducto(prod); setAbierto(true); }}
                                onEliminar={() => window.confirm(`¿Eliminar ${prod.nombre}?`) && crud.eliminar(prod)}
                                onCambioEstado={(activo) => crud.editar(prod, { activo })}
                            />
                        </div>
                    ))}
                </div>
                {!crud.loading && !productos.length && <p className="text-center text-secondary py-5">No hay productos.</p>}
            </div>
            {abierto && <AdminCatalogModal titulo={producto ? "Editar producto" : "Nuevo producto"} item={producto} campos={campos} guardar={guardar} cerrar={() => setAbierto(false)} saving={crud.saving} error={crud.error} />}
        </section>
    );
}