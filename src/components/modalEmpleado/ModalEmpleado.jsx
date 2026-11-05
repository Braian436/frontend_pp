import { useId } from "react";
import { Modal } from "react-bootstrap";
import styles from "./ModalEmpleado.module.css";

export default function ModalEmpleado({
    show,
    onHide,
    titulo,
    subtitulo,
    icono,
    size = "lg",
    children,
}) {
    const idTitulo = useId();

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            scrollable
            size={size}
            fullscreen="sm-down"
            contentClassName={styles.contenido}
            dialogClassName={styles.dialogo}
            backdropClassName={styles.fondo}
            aria-labelledby={idTitulo}
        >
            <Modal.Header closeButton closeVariant="white" className={styles.cabecera}>
                <Modal.Title className={styles.titulo} id={idTitulo}>
                    {icono && <span className={styles.icono}>{icono}</span>}
                    <span className={styles.textos}>
                        <span>{titulo}</span>
                        {subtitulo && <small>{subtitulo}</small>}
                    </span>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className={styles.cuerpo}>{children}</Modal.Body>
        </Modal>
    );
}
