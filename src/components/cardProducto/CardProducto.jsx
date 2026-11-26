import { useState } from "react";
import styles from "./CardProducto.module.css";

export default function CardProducto({
    producto,
    servicio,
    onEditar,
    onEliminar,
    onCambioEstado,
    onAgregarBarbero,
}) {
    const [barberoId, setBarberoId] = useState("");
    const item = producto ?? servicio ?? {};
    const { nombre, descripcion, estado } = item;

    const detalles = producto
        ? [
            ["Marca", producto.marca_nombre],
            ["Categoría", `${producto.categoria_nombre ?? ""}${producto.categoria_descripcion ? ` · ${producto.categoria_descripcion}` : ""}`],
            ["Descuento", `${producto.descuento_nombre ?? ""} · ${producto.descuento_mayorista == null ? "Tipo sin definir" : producto.descuento_mayorista ? "Mayorista" : "Minorista"} · ${producto.descuento_cantidad ?? "Sin cantidad"}`],
            ["Stock actual", producto.stock_actual],
            ["Stock mínimo", producto.stock_minimo ?? "Sin definir"],
        ]
        : [
            ["Barberos", servicio?.barberos?.length ? servicio.barberos.map((b) => b.nombre).join(", ") : "Sin barberos asignados"],
        ];

    const precios = producto
        ? [
            ["Último costo unitario", producto.costo_ultima_compra == null ? "Sin compras" : `$${producto.costo_ultima_compra}`],
            ["Último precio de venta", producto.precio_ultima_venta == null ? "Sin ventas" : `$${producto.precio_ultima_venta}`],
        ]
        : [
            ["Precio", `$${servicio?.precio ?? 0}`],
        ];

    const disponibles = servicio?.barberosDisponibles ?? [];

    const asignar = (e) => {
        e.preventDefault();
        if (!barberoId || !onAgregarBarbero) return;
        onAgregarBarbero(barberoId);
        setBarberoId("");
    };

    return (
        <div className={styles.card}>
            <div className={styles.foto}>
                <span className={styles.fotoTexto}>Foto</span>
            </div>

            <div className={styles.cuerpo}>
                <div className={styles.encabezado}>
                    <h2 className={styles.nombre}>{nombre}</h2>
                    {onCambioEstado && (
                        <span className={`${styles.indicador} ${estado ? styles.indicadorActivo : ""}`} aria-hidden="true"></span>
                    )}
                </div>

                <p className={styles.descripcion}>{descripcion || "Sin descripción"}</p>

                <div className={styles.detalles}>
                    {detalles.map(([etiqueta, valor]) => (
                        <p key={etiqueta}><span>{etiqueta}</span><strong>{valor}</strong></p>
                    ))}
                </div>

                <div className={styles.precios}>
                    {precios.map(([etiqueta, valor]) => (
                        <p key={etiqueta}><span>{etiqueta}</span><strong>{valor}</strong></p>
                    ))}
                </div>

                {onAgregarBarbero && disponibles.length > 0 && (
                    <form className={styles.asignarForm} onSubmit={asignar}>
                        <select
                            className={styles.selectBarbero}
                            value={barberoId}
                            onChange={(e) => setBarberoId(e.target.value)}
                            aria-label={`Añadir barbero a ${nombre}`}
                        >
                            <option value="">Añadir barbero...</option>
                            {disponibles.map((b) => (
                                <option key={b.id} value={b.id}>{b.nombre}</option>
                            ))}
                        </select>
                        <button type="submit" className={styles.botonAsignar} disabled={!barberoId}>
                            + Añadir
                        </button>
                    </form>
                )}

                <div className={styles.acciones}>
                    <div className={styles.botones}>
                        <button type="button" className={`${styles.boton} ${styles.botonEditar}`} onClick={onEditar}>
                            Editar
                        </button>
                        <button type="button" className={`${styles.boton} ${styles.botonStock}`} onClick={onEliminar}>
                            Eliminar
                        </button>
                    </div>

                    {onCambioEstado && (
                        <div className={styles.estado}>
                            <input
                                className={styles.switch}
                                type="checkbox"
                                checked={Boolean(estado)}
                                onChange={(evento) => onCambioEstado(evento.target.checked)}
                                aria-label={`Cambiar estado de ${nombre}`}
                            />
                            <span className={`${styles.estadoTexto} ${estado ? styles.estadoTextoActivo : ""}`}>
                                {estado ? "ACTIVO" : "INACTIVO"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
