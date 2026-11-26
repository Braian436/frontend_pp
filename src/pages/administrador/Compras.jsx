import { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { cargarProductosCompraApi, crearCompraApi, listarComprasApi } from "../../api/comprasApi.js";
import styles from "./Administrador.module.css";

const nuevaLinea = () => ({ id_producto: "", cantidad: "1", precio_unitario: "" });
const dinero = (importe) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(importe);
const filas = (respuesta) => Array.isArray(respuesta) ? respuesta : respuesta?.results ?? [];

export default function Compras() {
    const [productos, setProductos] = useState([]);
    const [compras, setCompras] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [paginas, setPaginas] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [abierto, setAbierto] = useState(false);
    const [lineas, setLineas] = useState([nuevaLinea()]);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    const solicitarDatos = useCallback((numeroPagina) => Promise.all([
        cargarProductosCompraApi(),
        listarComprasApi(numeroPagina),
    ]), []);

    const cargar = useCallback(async (numeroPagina = 1) => {
        try {
            const [listaProductos, respuestaCompras] = await solicitarDatos(numeroPagina);
            setError("");
            setProductos(filas(listaProductos));
            setCompras(filas(respuestaCompras));
            setPagina(numeroPagina);
            setPaginas(Math.max(1, Math.ceil((respuestaCompras.count ?? 0) / 10)));
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setCargando(false);
        }
    }, [solicitarDatos]);

    useEffect(() => {
        solicitarDatos(1).then(([listaProductos, respuestaCompras]) => {
            setProductos(filas(listaProductos));
            setCompras(filas(respuestaCompras));
            setPaginas(Math.max(1, Math.ceil((respuestaCompras.count ?? 0) / 10)));
            setError("");
        }).catch((fallo) => {
            setError(fallo.message);
        }).finally(() => {
            setCargando(false);
        });
    }, [solicitarDatos]);
    const cambiarPagina = (numeroPagina) => {
        setCargando(true);
        void cargar(numeroPagina);
    };

    const actualizarLinea = (indice, campo, valor) => setLineas((actuales) =>
        actuales.map((linea, posicion) => posicion === indice ? { ...linea, [campo]: valor } : linea)
    );
    const total = lineas.reduce((suma, linea) =>
        suma + Number(linea.cantidad || 0) * Number(linea.precio_unitario || 0), 0
    );

    const registrar = async (evento) => {
        evento.preventDefault();
        setGuardando(true);
        setError("");
        try {
            await crearCompraApi({
                detalles: lineas.map((linea) => ({
                    id_producto: Number(linea.id_producto),
                    cantidad: Number(linea.cantidad),
                    precio_unitario: Number(linea.precio_unitario),
                })),
            });
            setAbierto(false);
            setLineas([nuevaLinea()]);
            setCargando(true);
            await cargar(1);
        } catch (fallo) {
            setError(fallo.message);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <section className={`container-fluid py-4 text-white ${styles.pagina}`}>
            <div className="container">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <p className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</p>
                        <h1 className={styles.titulo}>Compras</h1>
                    </div>
                    <button className={`btn ${styles.botonNuevo}`} onClick={() => { setError(""); setAbierto(true); }}>
                        + Registrar compra
                    </button>
                </div>
                {error && !abierto && <p className="text-danger" role="alert">{error}</p>}
                {cargando && <p className="text-secondary text-center py-4">Cargando compras...</p>}
                {!cargando && !compras.length && <p className="text-secondary text-center py-5">Todavía no hay compras registradas.</p>}
                <div className="row g-3">
                    {compras.map((compra) => (
                        <div className="col-12 col-lg-6" key={compra.id_compra}>
                            <article className={`card h-100 ${styles.compra}`}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between gap-3 mb-3">
                                        <h2 className={styles.tituloCompra}>Compra #{compra.id_compra}</h2>
                                        <strong>{dinero(Number(compra.total))}</strong>
                                    </div>
                                    <p className={styles.fecha}>{new Date(compra.fecha).toLocaleString("es-AR")}</p>
                                    <div className="d-grid gap-2">
                                        {compra.detalles?.map((detalle) => (
                                            <div className={styles.detalle} key={detalle.id_detalle_compra}>
                                                <span>{detalle.producto_nombre} · {detalle.cantidad} unidades</span>
                                                <span>{dinero(Number(detalle.precio_unitario))} c/u</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
                {paginas > 1 && (
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                        <button className="btn btn-outline-light" disabled={pagina === 1 || cargando} onClick={() => cambiarPagina(pagina - 1)}>Anterior</button>
                        <span>Página {pagina} de {paginas}</span>
                        <button className="btn btn-outline-light" disabled={pagina === paginas || cargando} onClick={() => cambiarPagina(pagina + 1)}>Siguiente</button>
                    </div>
                )}
            </div>

            <Modal show={abierto} onHide={() => setAbierto(false)} centered size="lg" contentClassName={styles.modal}>
                <form onSubmit={registrar}>
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>Registrar compra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {lineas.map((linea, indice) => (
                            <div className="row g-2 align-items-end mb-3" key={indice}>
                                <div className="col-12 col-md-5">
                                    <label className="form-label" htmlFor={`producto-${indice}`}>Producto</label>
                                    <select id={`producto-${indice}`} className="form-select" value={linea.id_producto} onChange={(evento) => actualizarLinea(indice, "id_producto", evento.target.value)} required>
                                        <option value="">Seleccionar producto...</option>
                                        {productos.map((producto) => <option key={producto.id_producto} value={producto.id_producto}>{producto.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="col-6 col-md-2">
                                    <label className="form-label" htmlFor={`cantidad-${indice}`}>Cantidad</label>
                                    <input id={`cantidad-${indice}`} className="form-control" type="number" min="1" value={linea.cantidad} onChange={(evento) => actualizarLinea(indice, "cantidad", evento.target.value)} required />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label" htmlFor={`precio-${indice}`}>Costo unitario</label>
                                    <input id={`precio-${indice}`} className="form-control" type="number" min="0" step="0.01" value={linea.precio_unitario} onChange={(evento) => actualizarLinea(indice, "precio_unitario", evento.target.value)} required />
                                </div>
                                <div className="col-12 col-md-2">
                                    <button type="button" className={`btn w-100 ${styles.botonCancelar}`} disabled={lineas.length === 1} onClick={() => setLineas((actuales) => actuales.filter((_, posicion) => posicion !== indice))}>Quitar</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" className={`btn ${styles.botonSecundario}`} onClick={() => setLineas((actuales) => [...actuales, nuevaLinea()])}>+ Agregar producto</button>
                        <div className="text-end fs-5 mt-3">Total: <strong>{dinero(total)}</strong></div>
                        {error && <p className="text-danger mt-3 mb-0" role="alert">{error}</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className={`btn ${styles.botonCancelar}`} onClick={() => setAbierto(false)}>Cancelar</button>
                        <button type="submit" className={`btn ${styles.boton}`} disabled={guardando}>{guardando ? "Guardando..." : "Guardar compra"}</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </section>
    );
}
