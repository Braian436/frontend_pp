
import ListCardStats from "./ListCardStats"
import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import ListaTurnosAsignados from "../cliente/ListaTurnosAsignados.jsx"
export default function HomeBarber() {
  return (
    <div>
      <CardHomeBienvenida
        titulo={"PANEL DEL BARBERO"}
        descripcion={"Bienvenido"}
        detalle={"Estadaisticas Recurrentes"}
      />
      <ListCardStats/>
    </div>
  );
}
