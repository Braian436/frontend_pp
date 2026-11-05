import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from "../../assets/LOGO-BARBER.png";

export default function Navbar() {
    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>

                {/* Logo */}
                <NavLink to="/">
                    <img src={Logo} alt="Barbería Clase A" className={styles.logoRedondo}/>
                </NavLink>

                <ul className={styles.navMenu}>

                    <li className={styles.navItem}>
                        <NavLink to="/" end className={styles.botonLindo}>
                            INICIO
                        </NavLink>
                    </li>

                    <li className={styles.navItem}>
                        <NavLink to="/servicios" className={styles.botonLindo}>
                            SERVICIOS
                        </NavLink>
                    </li>

                    <li className={styles.navItem}>
                        <NavLink to="/barberos" className={styles.botonLindo}>
                            BARBEROS
                        </NavLink>
                    </li>

                    <li className={styles.navItem}>
                        <NavLink to="/empleados" className={styles.botonLindo}>
                            EMPLEADOS
                        </NavLink>
                    </li>

                    <li className={styles.navItem}>
                        <NavLink to="/registrar-turno" className={`${styles.botonLindo} ${styles.botonActivo}`}>
                            REGISTRAR TURNO
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}