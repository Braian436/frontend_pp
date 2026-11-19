import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from "../../assets/LOGO-BARBER.png";
import { useAuth } from "../../auth/AuthContext.jsx";
import { rutaInicialPorGrupo } from "../../auth/roles.js";

export default function Navbar() {
    const [abierto, setAbierto] = useState(false);
    const { usuario, grupo, autenticado, cerrarSesion } = useAuth();

    return (
        <header className={`${styles.header} sticky-top`}>
            <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbar}`}>
                <NavLink to="/" className="navbar-brand">
                    <img src={Logo} alt="Barbería Clase A" className={styles.logoRedondo} />
                </NavLink>
                <button className="navbar-toggler border-secondary" type="button" aria-label="Abrir navegación" aria-controls="navegacion-principal" aria-expanded={abierto} onClick={() => setAbierto(!abierto)}>
                    <span className="navbar-toggler-icon" />
                </button>
                <div id="navegacion-principal" className={`collapse navbar-collapse ${abierto ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">
                        <li className="nav-item"><NavLink to="/" end className={`nav-link ${styles.botonLindo}`} onClick={() => setAbierto(false)}>INICIO</NavLink></li>
                        <li className="nav-item"><NavLink to="/servicios" className={`nav-link ${styles.botonLindo}`} onClick={() => setAbierto(false)}>SERVICIOS</NavLink></li>
                        <li className="nav-item"><NavLink to="/registrar-turno" className={`nav-link ${styles.botonLindo} ${styles.botonActivo}`} onClick={() => setAbierto(false)}>REGISTRAR TURNO</NavLink></li>
                        {autenticado && <li className="nav-item">
                            <NavLink
                                to={rutaInicialPorGrupo[grupo] ?? "/"}
                                className={`nav-link ${styles.botonLindo}`}
                                onClick={() => setAbierto(false)}
                            >
                                PANEL
                            </NavLink>
                        </li>}
                        {autenticado && <li className="nav-item">
                            <button
                                type="button"
                                className={`nav-link ${styles.botonLindo} ${styles.botonSalir}`}
                                onClick={() => {
                                    setAbierto(false);
                                    cerrarSesion();
                                }}
                                title={usuario ? `Sesión de ${usuario}` : "Cerrar sesión"}
                            >
                                SALIR
                            </button>
                        </li>}
                    </ul>
                </div>
            </nav>
        </header>
    );
}