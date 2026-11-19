import { NavLink } from "react-router-dom";
import {
    LuCalendarDays,
    LuLogOut,
    LuPackage,
    LuReceipt,
    LuScissors,
    LuUserSearch,
    LuUsers,
    LuWallet,
} from "react-icons/lu";
import styles from "./NavbarAdministrador.module.css";
import Logo from "../../assets/LOGO-BARBER.png";
import { useAuth } from "../../auth/AuthContext.jsx";
import { menusPorGrupo, rutaInicialPorGrupo } from "../../auth/roles.js";

const iconos = {
    calendar: LuCalendarDays,
    receipt: LuReceipt,
    scissors: LuScissors,
    users: LuUsers,
};

const iconosPendientes = {
    Clientes: LuUserSearch,
    Servicios: LuScissors,
    Ventas: LuWallet,
    Cajas: LuWallet,
    "Movimientos de caja": LuReceipt,
    "Productos y stock": LuPackage,
};

export default function NavbarAdministrador() {
    const { usuario, grupo, cerrarSesion } = useAuth();
    const menu = menusPorGrupo[grupo] ?? { rutas: [], pendientes: [] };
    const rutaInicial = rutaInicialPorGrupo[grupo] ?? "/";

    return (
        <>
            <aside className={styles.sidebar}>
                <nav
                    className={`nav flex-column gap-2 ${styles.enlaces}`}
                    aria-label={`Navegación de ${grupo ?? "usuario"}`}
                >
                    {menu.rutas.map(({ label, to, icon }) => {
                        const Icono = iconos[icon];
                        return (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `nav-link ${styles.enlace} ${isActive ? styles.activo : ""}`
                                }
                            >
                                <Icono aria-hidden="true" />
                                {label}
                            </NavLink>
                        );
                    })}

                    {menu.pendientes.length > 0 && (
                        <>
                            <h2 className={styles.titulo}>Pendiente</h2>
                            {menu.pendientes.map((label) => {
                                const Icono = iconosPendientes[label];
                                return (
                                    <span
                                        className={`${styles.enlace} ${styles.pendiente}`}
                                        aria-disabled="true"
                                        key={label}
                                    >
                                        <Icono aria-hidden="true" />
                                        <span>{label}</span>
                                        <small>Pendiente</small>
                                    </span>
                                );
                            })}
                        </>
                    )}
                </nav>

                <button
                    type="button"
                    className={`btn d-flex align-items-center gap-2 ${styles.cerrarSesion}`}
                    onClick={cerrarSesion}
                >
                    <LuLogOut aria-hidden="true" /> Cerrar sesión
                </button>
            </aside>

            <header className={`d-flex align-items-center gap-3 ${styles.cabecera}`}>
                <NavLink
                    to={rutaInicial}
                    className={styles.logoCaja}
                    aria-label="Inicio del panel"
                >
                    <img src={Logo} alt="Barbería Clase A" />
                </NavLink>
                <p className={styles.saludo}>
                    {grupo} · <strong>{usuario}</strong>
                </p>
            </header>
        </>
    );
}
