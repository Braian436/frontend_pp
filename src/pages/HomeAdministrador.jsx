import { LuCalendarPlus, LuCircleDollarSign, LuClipboardList, LuPackage, LuReceipt, LuScissors, LuTicket, } from "react-icons/lu";
import { Link } from "react-router-dom";
import fondoAdministrador from "../assets/fachero3.png";
import imagenCeraMate from "../assets/CeraMate.png";
import imagenPomadaBrillo from "../assets/PomadaBrillo.png";
import imagenAceiteParaBarba from "../assets/AceiteParaBarba.png";
import styles from "./HomeAdministrador.module.css";

const indicadores = [
    {
        titulo: "Turnos de hoy",
        valor: "18",
        detalle: "12 confirmados · 6 pendientes",
        icono: LuCalendarPlus,
        color: "verde",
    },
    {
        titulo: "Caja del día",
        valor: "$ 186.500",
        detalle: "+8% vs. jueves anterior",
        icono: LuCircleDollarSign,
        color: "verde",
        id: "caja",
    },
    {
        titulo: "Tickets abiertos",
        valor: "4",
        icono: LuTicket,
    },
    {
        titulo: "Liquidaciones pendientes",
        valor: "3",
        detalle: "Cierre semanal en 3 días",
        icono: LuReceipt,
        color: "ambar",
        id: "liquidaciones",
    },
];

const productos = [
    {
        nombre: "Cera mate",
        categoria: "Styling",
        stock: 2,
        minimo: 5,
        precio: "$ 8.500",
        imagen: imagenCeraMate,
        varianteImagen: "producto1",
    },
    {
        nombre: "Pomada brillo",
        categoria: "Styling",
        stock: 12,
        minimo: 5,
        precio: "$ 9.200",
        imagen: imagenPomadaBrillo,
        varianteImagen: "producto2",
    },
    {
        nombre: "Aceite para barba",
        categoria: "Cuidado de barba",
        stock: 3,
        minimo: 4,
        precio: "$ 7.800",
        imagen: imagenAceiteParaBarba,
        varianteImagen: "producto3",
    },
];

const estiloFondo = {
    backgroundImage: `linear-gradient(90deg, rgba(12, 12, 12, 0.78), rgba(12, 12, 12, 0.25)), url("${fondoAdministrador}")`,
};

export default function HomeAdministrador() {
    return (
        <div className={`min-vh-100 ${styles.dashboard}`}>
            <section className={`d-flex align-items-center ${styles.hero}`} style={estiloFondo}>
                <div className={styles.heroTexto}>
                    <p className={styles.eyebrow}>Panel de administración</p>
                    <h1>Bienvenido, administrador</h1>
                    <p>Todo lo que necesitás para gestionar tu barbería, en un solo lugar.</p>
                </div>
            </section>

            <div className="container-fluid d-flex flex-column gap-4 px-3 px-lg-5 py-4">
                <section className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3" aria-label="Resumen del día">
                    {indicadores.map(({ titulo, valor, detalle, icono: Icono, color, id }) => (
                        <article className={`col ${styles.indicadorResumen}`} id={id} key={titulo}>
                            <div className={`card h-100 ${styles.tarjetaIndicador}`}>
                                <div className={`card-body d-flex flex-column gap-2 ${styles.cuerpoIndicador}`}>
                                    <div className={`d-flex align-items-center justify-content-between gap-2 ${styles.indicadorEncabezado}`}>
                                        <span>{titulo}</span><Icono aria-hidden="true" />
                                    </div>
                                    <strong className={styles.valor}>{valor}</strong>
                                    <span className={`${styles.detalle} ${styles[color]}`}>{detalle}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                <section className={styles.seccionProductos} id="productos" aria-labelledby="productos-titulo">
                    <div className={`d-flex align-items-end justify-content-between gap-3 mb-3 ${styles.encabezadoProductos}`}>
                        <div>
                            <h2 id="productos-titulo">Productos destacados</h2>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span className={styles.totalProductos}>{productos.length} productos</span>
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                        {productos.map((producto) => {
                            const stockBajo = producto.stock <= producto.minimo;

                            return (
                                <article className="col" key={producto.nombre}>
                                    <div className={`card h-100 ${styles.tarjetaProducto}`}>
                                        <div className={`d-flex align-items-center justify-content-center ${styles.imagenProducto} ${styles[producto.varianteImagen]}`}>
                                            {producto.imagen ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    className={styles.fotoProducto}
                                                />
                                            ) : (
                                                <LuPackage aria-hidden="true" />
                                            )}
                                        </div>
                                        <div className={`card-body ${styles.infoProducto}`}>
                                            <span className={styles.categoria}>{producto.categoria}</span>
                                            <h3>{producto.nombre}</h3>
                                            <div className="d-flex align-items-center justify-content-between gap-2">
                                                <span className={styles.precio}>{producto.precio}</span>
                                                <span className={stockBajo ? styles.stockBajo : styles.stockNormal}>
                                                    {producto.stock} en stock
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
