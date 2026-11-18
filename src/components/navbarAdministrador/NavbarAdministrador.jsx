import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LuBell, LuCircleAlert, LuHouse, LuLogOut, LuPackage, LuScissors, LuUsers } from "react-icons/lu";
import styles from "./NavbarAdministrador.module.css";
import Logo from "../../assets/LOGO-BARBER.png";
import { useAuth } from "../../auth/AuthContext.jsx";

const avisosStock = [
    { producto: "Cera mate", stock: 2, minimo: 5 },
    { producto: "Aceite para barba", stock: 3, minimo: 4 },
];

export default function NavbarAdministrador() {
    const [avisosAbiertos, setAvisosAbiertos] = useState(false);
    const { usuario, cerrarSesion } = useAuth();

    return (
        <>
            <aside className={styles.sidebar}>
                <nav className={`nav flex-column gap-2 ${styles.enlaces}`} aria-label="Navegación de administrador">
                    <NavLink to="/admin" end className={({ isActive }) => `nav-link ${styles.enlace} ${isActive ? styles.activo : ""}`}>
                        <LuHouse aria-hidden="true" /> Inicio
                    </NavLink>
                    <NavLink to="/admin/empleados" className={({ isActive }) => `nav-link ${styles.enlace} ${isActive ? styles.activo : ""}`}>
                        <LuUsers aria-hidden="true" /> Empleados
                    </NavLink>
                    <a href="/admin#productos" className={`nav-link ${styles.enlace}`}>
                        <LuPackage aria-hidden="true" /> Productos
                    </a>
                    <NavLink to="/servicios" className={({ isActive }) => `nav-link ${styles.enlace} ${isActive ? styles.activo : ""}`}>
                        <LuScissors aria-hidden="true" /> Servicios
                    </NavLink>
                </nav>
                <button type="button" className={`btn d-flex align-items-center gap-2 ${styles.cerrarSesion}`} onClick={cerrarSesion}>
                    <LuLogOut aria-hidden="true" /> Cerrar sesión
                </button>
            </aside>

            <header className={`d-flex align-items-center gap-3 ${styles.cabecera}`}>
                <NavLink to="/admin" className={styles.logoCaja} aria-label="Inicio de administración">
                    <img src={Logo} alt="Barbería Clase A" />
                </NavLink>
                <p className={styles.saludo}>Bienvenido, <strong>{usuario}</strong></p>
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
