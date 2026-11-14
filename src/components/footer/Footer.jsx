import { FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "./Footer.module.css";
import FondoFooter from "../../assets/Footer_imagen.png";

export default function Footer() {
    const horarios = [ "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", ];
    const estiloFondo = FondoFooter ? {backgroundImage: ` linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85) ), url("${FondoFooter}")`, } : {};

    return (
        <footer className={styles.footer} style={estiloFondo}>

            <div className={`container ${styles.contenedor}`}>

                <div className="row justify-content-center gy-5">

                    <div className={`col-12 col-md-5 d-flex flex-column align-items-center ${styles.contacto}`}>

                        <h2 className={styles.titulo}>Contacto</h2>

                        <div className={`d-flex flex-column align-items-center gap-3 ${styles.datosContacto}`}>

                            <div className={`d-flex align-items-center gap-3 ${styles.dato}`}>
                                <span className={styles.iconoBlanco}>
                                    <FaMapMarkerAlt className={styles.ubicacion}/>
                                </span>
                                <a href="https://maps.app.goo.gl/MBkYgDFP2jXBkbmg9">Barberia Clase A</a>
                            </div>

                            <div className={`d-flex align-items-center gap-3 ${styles.dato}`}>
                                <span className={styles.iconoBlanco}>
                                    <FaPhoneAlt />
                                </span>
                                <a href="tel:+54387666888">+54 387666888</a>
                            </div>

                        </div>

                        <div className={styles.correo}>
                            <a href="mailto:barberiaclasea@gmail.com">barberiaclasea@gmail.com</a>
                        </div>

                        <div className={`d-flex justify-content-center align-items-center gap-4 mt-3 ${styles.redes}`}>
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.facebook}
                                aria-label="Facebook"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.instagram}
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                        </div>

                    </div>

                    <div className={`col-12 col-md-5 d-flex flex-column align-items-center ${styles.horarios}`}>

                        <h2 className={styles.titulo}>Nuestros Horarios</h2>

                        <div className={`d-flex flex-column gap-2 w-100 ${styles.listaHorarios}`}>

                            {horarios.map((dia) => (
                                <div key={dia} className={`d-flex align-items-baseline gap-2 ${styles.filaHorario}`}>
                                    <span>{dia}</span>
                                    <span className={styles.puntos}></span>
                                    <span>10:00 - 22:00</span>
                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        {/* COPYRIGHT */}
        <div className={`text-center mt-5 ${styles.copyright}`}>
            {new Date().getFullYear()} Barbería Clase A.
            {" "}© Todos los derechos reservados
        </div>

        </footer>
    );
}