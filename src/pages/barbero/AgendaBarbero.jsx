import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import ListaTurno from "../../components/C.ListaTurno/ListaTurno.jsx";
import styles from "./AgendaBarbero.module.css";

export default function AgendaBarbero() {
  return (
    <section className={styles.contenedorPrincipal} data-bs-theme="dark">
      <CardHomeBienvenida
        titulo="PANEL DEL BARBERO"
        descripcion="MI AGENDA"
        detalle="Consultá tus turnos"
      />

      <ListaTurno />
    </section>
  );
}