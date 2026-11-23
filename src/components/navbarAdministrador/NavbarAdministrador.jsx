import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LuBell, LuCircleAlert, LuDollarSign, LuHouse, LuPackage, LuScissors, LuUserSearch, LuUsers, } from "react-icons/lu";
import styles from "./NavbarAdministrador.module.css";
import Logo from "../../assets/LOGO-BARBER.png";

const avisosStock = [
    { producto: "Cera mate", stock: 2, minimo: 5 },
    { producto: "Aceite para barba", stock: 3, minimo: 4 },
];

const itemsNavbarAdministrador = [
    { type: "link", label: "Inicio", to: "/admin", icon: "home" },
    { type: "link", label: "Nuevo Turno", icon: "scissors", disabled: true },
    { type: "heading", label: "Gestion" },
    { type: "link", label: "Caja", icon: "dollar", disabled: true },
    { type: "link", label: "Empleados", to: "/admin/empleados", icon: "users" },
    { type: "link", label: "Productos", to: "/admin/productos", icon: "package" },
    { type: "link", label: "Servicios", to: "/admin/servicios", icon: "scissors" },
    { type: "link", label: "Clientes", icon: "userSearch", disabled: true },
];

const iconos = {
    home: LuHouse,
    scissors: LuScissors,
    dollar: LuDollarSign,
    users: LuUsers,
    package: LuPackage,
    userSearch: LuUserSearch,
};

export default function NavbarAdministrador() {
    const [avisosAbiertos, setAvisosAbiertos] = useState(false);

    return (
        <>
            <aside className={styles.sidebar}>
                <nav className={`nav flex-column gap-2 ${styles.enlaces}`} aria-label="Navegación de administrador">
                    {itemsNavbarAdministrador.map((item) => {
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
                <NavLink to="/admin" className={styles.logoCaja} aria-label="Inicio de administración">
                    <img src={Logo} alt="Barbería Clase A" />
                </NavLink>
                <p className={styles.saludo}>Barbería <strong>Clase A</strong></p>
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
                        <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${styles.contador}`}>
                            {avisosStock.length}
                        </span>
                    </button>
                    {avisosAbiertos && (
                        <div id="avisos-stock" className={`position-absolute top-100 end-0 mt-2 p-3 shadow ${styles.panelAvisos}`}>
                            <h2 className="mb-3">Avisos de stock</h2>
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
            </header>
        </>
    );
}