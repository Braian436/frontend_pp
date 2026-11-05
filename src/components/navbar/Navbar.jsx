import React from "react";
import styles from "./Navbar.module.css";
import Logo from "../../assets/LOGO-BARBER.png";

export default function Navbar() {
    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                
                {/* Logo */}
                <a href="#inicio" className={styles.brand}>
                    <img src={Logo} alt="Barbería Clase A" className={styles.logoRedondo} />
                </a>

                <ul className={styles.navMenu}>
                    <li className={styles.navItem}>
                        <a href="#servicios" className={styles.botonLindo}>
                            INICIO
                        </a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="#nosotros" className={styles.botonLindo}>
                            SERVICIOS
                        </a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="#contacto" className={styles.botonLindo}>
                            BARBEROS
                        </a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="#inicio" className={`${styles.botonLindo} ${styles.botonActivo}`}>
                            REGISTRAR TURNO
                        </a>
                    </li>
                </ul>
                
            </nav>
        </header>
    );
}