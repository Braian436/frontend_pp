import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LuBell, LuCircleAlert, LuDollarSign, LuDoorClosed, LuHouse, LuPackage, LuScissors, LuTicket, LuUserSearch, LuUsers, LuWallet } from "react-icons/lu";
import styles from "./NavbarAdministrador.module.css";
import Logo from "../../assets/LOGO-BARBER.png";
import { cargarProductosApi } from "../../api/productosApi.js";
import { obtenerAvisosStock } from "./stockNotifications.js";

const menuAdministrador = [
    { type: "link", label: "Inicio", to: "/admin", icon: "home", end: true },
    { type: "link", label: "Nuevo Turno", icon: "scissors", disabled: true },
    { type: "heading", label: "Gestion" },
    { type: "link", label: "Caja", to: "/admin/caja", icon: "dollar" },
    { type: "link", label: "Empleados", to: "/admin/empleados", icon: "users" },
    { type: "link", label: "Productos", to: "/admin/productos", icon: "package" },
    { type: "link", label: "Marcas", to: "/admin/marcas", icon: "package" },
    { type: "link", label: "Categorías", to: "/admin/categorias", icon: "package" },
    { type: "link", label: "Descuentos", to: "/admin/descuentos", icon: "ticket" },
    { type: "link", label: "Compras", to: "/admin/compras", icon: "ticket" },
    { type: "link", label: "Servicios", to: "/admin/servicios", icon: "scissors" },
    { type: "link", label: "Clientes", to: "/admin/clientes", icon: "userSearch" },
];

const menuCajero = [
    { type: "link", label: "Inicio", to: "/cajero", icon: "home", end: true },
    { type: "link", label: "Caja", to: "/cajero/caja", icon: "wallet" },
    { type: "link", label: "Tickets", to: "/cajero/tickets", icon: "ticket" },
    { type: "link", label: "Servicios", to: "/cajero/servicios", icon: "scissors" },
];

const menuBarbero = [
    { type: "link", label: "Inicio", to: "/home-barbero", icon: "home", end: true },
    { type: "link", label: "Agenda", to: "/home-barbero/agenda", icon: "wallet" },

    { type: "link", label: "Salir", to: "/home-cliente", icon: "door" },
];

const iconos = {
    home: LuHouse,
    scissors: LuScissors,
    dollar: LuDollarSign,
    users: LuUsers,
    package: LuPackage,
    userSearch: LuUserSearch,
    wallet: LuWallet,
    ticket: LuTicket,
    door: LuDoorClosed,

};

export default function NavbarAdministrador() {
    const [avisosAbiertos, setAvisosAbiertos] = useState(false);
    const [avisosStock, setAvisosStock] = useState([]);
    const { pathname } = useLocation();
    
    const esCajero = pathname === "/cajero" || pathname.startsWith("/cajero/");
    const esBarbero = pathname === "/home-barbero" || pathname.startsWith("/home-barbero/");
    
    const items = esCajero ? menuCajero : esBarbero ? menuBarbero : menuAdministrador;
    const rutaInicio = esCajero ? "/cajero" : esBarbero ? "/home-barbero" : "/admin";
    const ariaNav = esCajero ? "Navegación de caja" : esBarbero ? "Navegación de barbero" : "Navegación de administrador";
    const ariaLogo = esCajero ? "Inicio de caja" : esBarbero ? "Inicio de barbero" : "Inicio de administración";

    useEffect(() => {
        if (esCajero || esBarbero) return undefined;

        const controller = new AbortController();
        const actualizarAvisos = () => {
            cargarProductosApi(controller.signal)
                .then((respuesta) => setAvisosStock(
                    obtenerAvisosStock(Array.isArray(respuesta) ? respuesta : respuesta.results ?? [])
                ))
                .catch((fallo) => {
                    if (fallo.name !== "AbortError") setAvisosStock([]);
                });
        };

        actualizarAvisos();
        const intervalo = window.setInterval(actualizarAvisos, 60000);
        return () => {
            controller.abort();
            window.clearInterval(intervalo);
        };
    }, [esCajero, esBarbero, pathname]);

    return (
        <>
            <aside className={styles.sidebar}>
                <nav className={`nav flex-column gap-2 ${styles.enlaces}`} aria-label={ariaNav}>
                    {items.map((item) => {
                        if (item.type === "heading") {
                            return (
                                <h3 className={styles.titulo} key={item.label}>
                                    {item.label}
                                </h3>
                            );
                        }

                        const Icono = iconos[item.icon];
                        if (item.disabled) {
                            return (
                                <button
                                    type="button"
                                    className={`nav-link ${styles.enlace} ${styles.pendiente}`}
                                    disabled
                                    key={item.label}
                                >
                                    <Icono aria-hidden="true" />
                                    <span>{item.label}</span>
                                    <small>Pendiente</small>
                                </button>
                            );
                        }

                        return (
                            <NavLink
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `nav-link ${styles.enlace} ${isActive ? styles.activo : ""}`
                                }
                                key={item.label}
                            >
                                <Icono aria-hidden="true" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            <header className={`d-flex align-items-center gap-3 ${styles.cabecera}`}>
                <NavLink to={rutaInicio} className={styles.logoCaja} aria-label={ariaLogo}>
                    <img src={Logo} alt="Barbería Clase A" />
                </NavLink>
                <p className={styles.saludo}>
                    {esCajero ? (
                        <>Panel de <strong>caja</strong></>
                    ) : esBarbero ? (
                        <>Panel de <strong>Barbero</strong></>
                    ) : (
                        <>Barbería <strong>Clase A</strong></>
                    )}
                </p>
                {!esCajero && !esBarbero && (
                    <div className="position-relative ms-auto">
                        <button
                            type="button"
                            className={`btn d-inline-flex align-items-center justify-content-center position-relative ${styles.botonAvisos}`}
                            aria-label={`${avisosStock.length} avisos de bajo stock`}
                            aria-expanded={avisosAbiertos}
                            aria-controls="avisos-stock"
                            onClick={() => setAvisosAbiertos((abiertos) => !abiertos)}
                        >
                            <LuBell aria-hidden="true" />
                            {avisosStock.length > 0 && (
                                <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${styles.contador}`}>
                                    {avisosStock.length}
                                </span>
                            )}
                        </button>
                        {avisosAbiertos && (
                            <div id="avisos-stock" className={`position-absolute top-100 end-0 mt-2 p-3 shadow ${styles.panelAvisos}`}>
                                <h2 className="mb-3">Avisos de stock</h2>
                                {avisosStock.length === 0 && <p className="text-white mb-0">No hay productos con bajo stock.</p>}
                                {avisosStock.map((aviso) => (
                                    <div key={aviso.producto} className={`d-flex align-items-start gap-2 py-2 ${styles.aviso}`}>
                                        <LuCircleAlert aria-hidden="true" />
                                        <p className="d-grid gap-1 mb-0">
                                            <strong>{aviso.producto}</strong>
                                            <span>{aviso.stock} unidades · mínimo {aviso.minimo}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </header>
        </>
    );
}
