import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from "../../assets/LOGO-BARBER.png";

export default function Navbar() {
    const [abierto, setAbierto] = useState(false);

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
                    </ul>
                </div>
            </nav>
        </header>
    );
}