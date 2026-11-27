import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import ListaTurno from "../../components/cardListaTurno/ListaTurno.jsx";

import styles from "../barbero/HomeBarber.module.css";

export default function AgendaAdministrador() {
  return (
    <div className={styles.contenedorPrincipal}>
      <CardHomeBienvenida
        titulo="PANEL DE ADMINISTRACIÓN"
        descripcion="MI AGENDA"
        detalle="Consultá y gestioná tus turnos"
      />

      <ListaTurno />
    </div>
  );
}
