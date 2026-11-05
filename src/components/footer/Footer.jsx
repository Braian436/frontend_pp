
import { Container, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaInstagram, } from "react-icons/fa";
import styles from "./Footer.module.css";
import FondoFooter from "../../assets/Footer_imagen.png";

export default function Footer() {
    const horarios = [ "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", ];
    const estiloFondo = FondoFooter ? {backgroundImage: ` linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85) ), url("${FondoFooter}")`, } : {};

    return (
        <footer className={styles.footer} style={estiloFondo}>

            <Container className={styles.contenedor}>

                <Row className="justify-content-center gy-5">

                    <Col xs={12} md={5} className={styles.contacto}>

                        <h2 className={styles.titulo}>Contacto</h2>

                        <div className={styles.datosContacto}>

                        <div className={styles.dato}>
                            <span className={styles.iconoBlanco}>
                                <FaMapMarkerAlt className={styles.ubicacion}/>
                            </span>
                            <a href="https://maps.app.goo.gl/MBkYgDFP2jXBkbmg9">Barberia Clase A</a>
                        </div>

                        <div className={styles.dato}>
                            <span className={styles.iconoBlanco}>
                                <FaPhoneAlt />
                            </span>
                            <a href="tel:+54387666888">+54 387666888</a>
                        </div>

                        </div>

                        <div className={styles.correo}>
                            <a href="mailto:barberiaclasea@gmail.com">barberiaclasea@gmail.com</a>
                        </div>

                        <div className={styles.redes}>

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

                    </Col>

                    {/* HORARIOS */}
                    <Col xs={12} md={5} className={styles.horarios}>

                        <h2 className={styles.titulo}>Nuestros Horarios</h2>

                        <div className={styles.listaHorarios}>

                            {horarios.map((dia) => (
                                <div key={dia} className={styles.filaHorario}>
                                    <span>{dia}</span>
                                    <span className={styles.puntos}></span>
                                    <span>10:00 - 22:00</span>
                                </div>
                            ))}

                        </div>

                    </Col>

                </Row>

            </Container>

        {/* COPYRIGHT */}
        <div className={styles.copyright}>
            {new Date().getFullYear()} Barbería Clase A.
            {" "}© Todos los derechos reservados
        </div>

        </footer>
    );
}
