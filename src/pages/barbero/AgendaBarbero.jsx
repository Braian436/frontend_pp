import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import ListaTurno from "../../components/cardListaTurno/ListaTurno.jsx";

import styles from "./HomeBarber.module.css";
export default function AgendaBarbero() {
  return (
    <div className={styles.contenedorPrincipal}>
      <CardHomeBienvenida
        titulo="PANEL DEL BARBERO"
        descripcion="MI AGENDA"
        detalle="Consultá tus turnos"
      />

      <ListaTurno />
    </div>
  );
}