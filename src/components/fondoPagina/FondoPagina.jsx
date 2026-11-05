import styles from "./FondoPagina.module.css";

export default function FondoPagina({ imagen, children }) {
    return (
        <section className={styles.fondoPagina} style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.70) ), url("${imagen}")`,}}> {children}
        </section>
    );
}