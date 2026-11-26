import logo from "../../assets/logo_barber.png";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({ children }) {
    return (
        <div className={styles.pagina}>
            <main className={`container ${styles.centro}`}>
                <div className={`card ${styles.tarjeta}`}>
                    <div className={`card-body ${styles.cuerpo}`}>
                        <div className={styles.marca}>
                            <img
                                src={logo}
                                alt="Barbería Clase A"
                                className={styles.logo}
                            />
                        </div>

                        {children}
                    </div>
                </div>

                <p className={styles.ubicacion}>SALTA, ARGENTINA</p>
            </main>
        </div>
    );
}
