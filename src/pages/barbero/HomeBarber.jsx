
import ListCardStats from "./ListCardStats"
import CardHomeBienvenida from "../../components/cardHomeBienvenida/CardHomeBienvenida.jsx";
import ListaTurnos from "./ListaTurnos.jsx"
import styles from "./HomeBarber.module.css"


export default function HomeBarber() {
const claveFecha = (f) => f.toLocaleDateString("en-CA");
const HOY = claveFecha(new Date());

const LISTA_DE_TURNOS = [
  {
    id: 1,
    fecha: HOY,
    horaInicio: "10:00",
    horaFin: "10:45",
    cliente: "Lucas Gómez",
    servicio: "Corte de pelo",
    estado: "finalizado",
  },
  {
    id: 2,
    fecha: HOY,
    horaInicio: "11:00",
    horaFin: "11:30",
    cliente: "Matías Rojas",
    servicio: "Perfilado de barba",
    estado: "enCurso",
  },
  {
    id: 3,
    fecha: HOY,
    horaInicio: "12:00",
    horaFin: "13:00",
    cliente: "Nicolás Pérez",
    servicio: "Corte + barba",
    estado: "pendiente",
  },
];
  return (
    <div className={styles.contenedorPrincipal}>
      <CardHomeBienvenida
        titulo={"PANEL DEL BARBERO"}
        descripcion={"Bienvenido"}
        detalle={"Estadisticas Recurrentes"}
      />
      <ListCardStats/>
      <ListaTurnos 
      turnos={LISTA_DE_TURNOS}
      />
    </div>
  );
}
