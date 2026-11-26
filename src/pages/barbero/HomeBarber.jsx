
import ListCardStats from "./ListCardStats"
import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import ListaTurno from "../../components/C.ListaTurno/ListaTurno.jsx"
import styles from "./HomeBarber.module.css"
export default function HomeBarber() {
  return (
    <div className={styles.contenedorPrincipal}>
      <CardHomeBienvenida
        titulo={"PANEL DEL BARBERO"}
        descripcion={"Bienvenido"}
        detalle={"Estadisticas Recurrentes"}
      />
      <ListCardStats/>
    </div>
  );
}
