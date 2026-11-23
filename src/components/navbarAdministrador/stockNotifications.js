export function obtenerAvisosStock(productos) {
    return productos
        .filter((producto) =>
            producto.stock_minimo != null &&
            Number(producto.stock_actual) < Number(producto.stock_minimo)
        )
        .map((producto) => ({
            producto: producto.nombre,
            stock: Number(producto.stock_actual),
            minimo: Number(producto.stock_minimo),
        }));
}
