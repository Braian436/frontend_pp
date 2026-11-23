import slide1 from "../../assets/slide1.png";
import slide2 from "../../assets/slide2.png";
import slide3 from "../../assets/slide3.png";
import ListCardStats from "./ListCardStats"
import styles from "./HomeBarber.module.css";
import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import ListaTurnosAsignados from "../cliente/ListaTurnosAsignados.jsx"
export default function HomeBarber() {
  return (
    <div>
      <div></div>
      <CardHomeBienvenida
        titulo={"PANEL DEL BARBERO"}
        descripcion={"Bienvenido"}
        detalle={"Estadaisticas Recurrentes"}
      />
      <ListCardStats/>
      
      
    </div>
  );
}
