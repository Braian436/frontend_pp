import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CajaModal from "../cajaModal/CajaModal.jsx";
import { apiRequest } from "../../api/apiRequest.js";
import { normalizarFilas } from "../../pages/cajero/cajaData.js";
import styles from "./NuevoTicketModal.module.css";

export default function AgregarItemTicketModal({ ticket, onCerrar, onConfirmar, procesando = false, error = "" }) {
    const [cargando, setCargando] = useState(true);
    const [servicios, setServicios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [tipo, setTipo] = useState("servicio");
    const [idItem, setIdItem] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            const pedir = (r) => apiRequest(r, { signal: controller.signal }).catch(() => []);
            const [servs, prods, precios] = await Promise.all([pedir("/servicios/"), pedir("/productos/"), pedir("/productos/precios/")]);
            if (controller.signal.aborted) return;
            const filasPrecios = normalizarFilas(precios, ["precios"]);
            const mapa = new Map(filasPrecios.map((p) => [String(p.id_producto), p.precio_ultima_venta]));
            setServicios(normalizarFilas(servs, ["servicios"]));
            setProductos(normalizarFilas(prods, ["productos"]).map((p) => ({ ...p, precio: mapa.get(String(p.id_producto ?? p.id)) ?? null })));
            setCargando(false);
        };
        void cargar();
        return () => controller.abort();
    }, []);

    const opciones = tipo === "servicio" ? servicios : productos.filter((p) => p.precio != null);

    const confirmar = () => {
        if (!idItem) { setLocalError("Seleccioná un ítem."); return; }
        const cant = Math.max(1, Number(cantidad) || 1);
        setLocalError("");
        onConfirmar({ tipo, id_item: Number(idItem), cantidad: cant });
    };

    return (
        <CajaModal
            titulo="Agregar al ticket"
            descripcion={`Ticket #${ticket.id} · ${ticket.cliente}`}
            icono={LuPlus}
            onCerrar={onCerrar}
            onConfirmar={confirmar}
            textoConfirmar="Agregar"
            procesando={procesando || cargando}
            error={localError || error}
        >
            {cargando ? <p className={styles.aviso}>Cargando...</p> : (
                <>
                    <div className={styles.seccion}>
                        <div className={styles.etiqueta}>Tipo</div>
                        <div className={styles.pestanas}>
                            <button type="button" className={`${styles.pestana} ${tipo === "servicio" ? styles.activa : ""}`} onClick={() => { setTipo("servicio"); setIdItem(""); }}>Servicio</button>
                            <button type="button" className={`${styles.pestana} ${tipo === "producto" ? styles.activa : ""}`} onClick={() => { setTipo("producto"); setIdItem(""); }}>Producto</button>
                        </div>
                    </div>
                    <div className={styles.seccion}>
                        <label className={styles.etiqueta} htmlFor="agregar-item">Ítem</label>
                        <select id="agregar-item" className={styles.input} value={idItem} onChange={(e) => setIdItem(e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {opciones.map((o) => {
                                const id = o.id_servicio ?? o.id_producto ?? o.id;
                                const nombre = o.nombre;
                                const precio = tipo === "servicio" ? o.precio : o.precio;
                                return <option key={id} value={id}>{nombre} {precio != null ? `- $${Number(precio).toLocaleString("es-AR")}` : ""}</option>;
                            })}
                        </select>
                    </div>
                    <div className={styles.seccion}>
                        <label className={styles.etiqueta} htmlFor="agregar-cantidad">Cantidad</label>
                        <input id="agregar-cantidad" className={styles.input} type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                    </div>
                </>
            )}
        </CajaModal>
    );
}