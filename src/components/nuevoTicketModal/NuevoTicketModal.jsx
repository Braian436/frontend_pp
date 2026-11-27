import { useEffect, useState } from "react";
import { LuTicket } from "react-icons/lu";
import CajaModal from "../cajaModal/CajaModal.jsx";
import { apiRequest } from "../../api/apiRequest.js";
import { dinero, normalizarFilas } from "../../pages/cajero/cajaData.js";
import styles from "./NuevoTicketModal.module.css";

const idDe = (fila) => String(fila?.id_servicio ?? fila?.id_producto ?? fila?.id ?? "");

export default function NuevoTicketModal({
    onCerrar,
    onConfirmar,
    procesando = false,
    error = "",
}) {
    const [cargando, setCargando] = useState(true);
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [errorLocal, setErrorLocal] = useState("");

    const [modoCliente, setModoCliente] = useState("existente");
    const [busqueda, setBusqueda] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [clienteNuevo, setClienteNuevo] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
    });
    const [cantServicios, setCantServicios] = useState({});
    const [cantProductos, setCantProductos] = useState({});
    const [descuento, setDescuento] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        let activo = true;

        const cargar = async () => {
            const pedir = (ruta) =>
                apiRequest(ruta, { signal: controller.signal }).catch(() => null);

            const [clientesData, serviciosData, productosData, preciosData] =
                await Promise.all([
                    pedir("/clientes/"),
                    pedir("/servicios/"),
                    pedir("/productos/"),
                    pedir("/productos/precios/"),
                ]);

            if (!activo) return;

            setClientes(normalizarFilas(clientesData ?? [], ["clientes"]));
            setServicios(normalizarFilas(serviciosData ?? [], ["servicios"]));

            const filasProductos = normalizarFilas(productosData ?? [], ["productos"]);
            const filasPrecios = normalizarFilas(preciosData ?? [], ["precios"]);
            const precios = new Map(
                filasPrecios.map((p) => [String(p.id_producto), p.precio_ultima_venta])
            );
            setProductos(
                filasProductos.map((p) => ({
                    ...p,
                    precio: precios.get(String(p.id_producto ?? p.id)) ?? null,
                }))
            );

            setCargando(false);
        };

        void cargar();

        return () => {
            activo = false;
            controller.abort();
        };
    }, []);

    const clientesFiltrados = clientes.filter((c) => {
        const texto = busqueda.trim().toLowerCase();
        if (!texto) return true;
        const completo = `${c.nombre ?? ""} ${c.apellido ?? ""}`.toLowerCase();
        return completo.includes(texto) || String(c.telefono ?? "").includes(texto);
    });

    const serviciosElegidos = servicios.filter(
        (s) => (cantServicios[idDe(s)] ?? 0) > 0
    );
    const productosElegidos = productos.filter(
        (p) => p.precio != null && (cantProductos[idDe(p)] ?? 0) > 0
    );

    const totalServicios = serviciosElegidos.reduce(
        (suma, s) => suma + Number(s.precio) * (cantServicios[idDe(s)] ?? 0),
        0
    );
    const totalProductos = productosElegidos.reduce(
        (suma, p) => suma + Number(p.precio) * (cantProductos[idDe(p)] ?? 0),
        0
    );
    const subtotal = totalServicios + totalProductos;
    const total = subtotal - (Number(descuento) || 0);

    const cambiarCantidad = (setCantidades, id, cantidad) => {
        setCantidades((previas) => ({
            ...previas,
            [id]: Math.max(0, Math.floor(Number(cantidad) || 0)),
        }));
    };

    const confirmar = () => {
        let datosCliente;
        if (modoCliente === "existente") {
            if (!clienteSeleccionado) {
                setErrorLocal("Elegí un cliente.");
                return;
            }
            datosCliente = { id_cliente: Number(clienteSeleccionado) };
        } else {
            const { nombre, apellido, telefono } = clienteNuevo;
            if (!nombre.trim() || !apellido.trim() || !telefono.trim()) {
                setErrorLocal("Completá nombre, apellido y teléfono del cliente.");
                return;
            }
            datosCliente = {
                cliente: {
                    nombre: nombre.trim(),
                    apellido: apellido.trim(),
                    telefono: telefono.trim(),
                },
            };
        }

        const listaServicios = serviciosElegidos.map((s) => ({
            id_servicio: Number(s.id_servicio ?? s.id),
            cantidad: cantServicios[idDe(s)],
        }));
        const listaProductos = productosElegidos.map((p) => ({
            id_producto: Number(p.id_producto ?? p.id),
            cantidad: cantProductos[idDe(p)],
        }));

        if (!listaServicios.length && !listaProductos.length) {
            setErrorLocal("Agregá al menos un servicio o producto.");
            return;
        }

        setErrorLocal("");
        onConfirmar({
            ...datosCliente,
            servicios: listaServicios,
            productos: listaProductos,
            descuento: Number(descuento) || 0,
        });
    };

    return (
        <CajaModal
            titulo="Nuevo ticket"
            descripcion="Elegí el cliente y agregá servicios o productos."
            icono={LuTicket}
            onCerrar={onCerrar}
            onConfirmar={confirmar}
            textoConfirmar="Crear ticket"
            procesando={procesando || cargando}
            error={errorLocal || error}
        >
            {cargando ? (
                <p className={styles.aviso}>Cargando opciones...</p>
            ) : (
                <>
                    <div className={styles.seccion}>
                        <div className={styles.etiqueta}>Cliente</div>
                        <div className={styles.pestanas}>
                            <button
                                type="button"
                                className={`${styles.pestana} ${
                                    modoCliente === "existente" ? styles.activa : ""
                                }`}
                                onClick={() => setModoCliente("existente")}
                            >
                                Cliente existente
                            </button>
                            <button
                                type="button"
                                className={`${styles.pestana} ${
                                    modoCliente === "nuevo" ? styles.activa : ""
                                }`}
                                onClick={() => setModoCliente("nuevo")}
                            >
                                Cliente nuevo
                            </button>
                        </div>

                        {modoCliente === "existente" ? (
                            <>
                                <input
                                    className={styles.input}
                                    type="search"
                                    placeholder="Buscar por nombre o teléfono"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                                <select
                                    className={styles.input}
                                    value={clienteSeleccionado}
                                    onChange={(e) => {
                                        setClienteSeleccionado(e.target.value);
                                        setErrorLocal("");
                                    }}
                                >
                                    <option value="">Seleccioná un cliente</option>
                                    {clientesFiltrados.map((c) => (
                                        <option
                                            key={c.id_cliente ?? c.id}
                                            value={c.id_cliente ?? c.id}
                                        >
                                            {c.nombre} {c.apellido} · {c.telefono}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <div className={styles.gridCliente}>
                                <input
                                    className={styles.input}
                                    placeholder="Nombre"
                                    value={clienteNuevo.nombre}
                                    onChange={(e) =>
                                        setClienteNuevo((v) => ({
                                            ...v,
                                            nombre: e.target.value,
                                        }))
                                    }
                                />
                                <input
                                    className={styles.input}
                                    placeholder="Apellido"
                                    value={clienteNuevo.apellido}
                                    onChange={(e) =>
                                        setClienteNuevo((v) => ({
                                            ...v,
                                            apellido: e.target.value,
                                        }))
                                    }
                                />
                                <input
                                    className={styles.input}
                                    placeholder="Teléfono"
                                    value={clienteNuevo.telefono}
                                    onChange={(e) =>
                                        setClienteNuevo((v) => ({
                                            ...v,
                                            telefono: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.seccion}>
                        <div className={styles.etiqueta}>Servicios</div>
                        {servicios.length === 0 ? (
                            <p className={styles.aviso}>No hay servicios cargados.</p>
                        ) : (
                            <ul className={`${styles.lista} scrollbar-app`}>
                                {servicios.map((s) => {
                                    const id = idDe(s);
                                    return (
                                        <li key={id} className={styles.item}>
                                            <div>
                                                <strong>{s.nombre}</strong>
                                                <span>{dinero(s.precio)}</span>
                                            </div>
                                            <input
                                                className={styles.cantidad}
                                                type="number"
                                                min="0"
                                                value={cantServicios[id] ?? 0}
                                                onChange={(e) =>
                                                    cambiarCantidad(
                                                        setCantServicios,
                                                        id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className={styles.seccion}>
                        <div className={styles.etiqueta}>Productos</div>
                        {productos.length === 0 ? (
                            <p className={styles.aviso}>No hay productos cargados.</p>
                        ) : (
                            <ul className={`${styles.lista} scrollbar-app`}>
                                {productos.map((p) => {
                                    const id = idDe(p);
                                    const sinPrecio = p.precio == null;
                                    const sinStock = Number(p.stock_actual) <= 0;
                                    return (
                                        <li key={id} className={styles.item}>
                                            <div>
                                                <strong>{p.nombre}</strong>
                                                <span>
                                                    {sinPrecio
                                                        ? "Sin precio"
                                                        : dinero(p.precio)}
                                                    {!sinPrecio &&
                                                        ` · stock ${p.stock_actual}`}
                                                </span>
                                            </div>
                                            <input
                                                className={styles.cantidad}
                                                type="number"
                                                min="0"
                                                disabled={sinPrecio || sinStock}
                                                value={cantProductos[id] ?? 0}
                                                onChange={(e) =>
                                                    cambiarCantidad(
                                                        setCantProductos,
                                                        id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className={styles.descuento}>
                        <label htmlFor="ticket-descuento">Descuento (opcional)</label>
                        <input
                            id="ticket-descuento"
                            className={styles.input}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            value={descuento}
                            onChange={(e) => setDescuento(e.target.value)}
                        />
                    </div>

                    <p className={styles.total}>
                        Total <strong>{dinero(total)}</strong>
                    </p>
                </>
            )}
        </CajaModal>
    );
}
