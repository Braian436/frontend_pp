import CardTurno from "../../components/cardCardTurnoAgenda/CardTurno";
import styles from "./ListaTurnos.module.css";

function ListaTurnos({ turnos, iniciarTurno }) {
  return (
    <div className="d-flex flex-column gap-2">
      {turnos.length === 0 ? (
        <p className={styles.vacio}>No hay turnos para mostrar</p>
      ) : (
        turnos.map((turno) => (
          <CardTurno
            key={turno.id}
            horaInicio={turno.horaInicio}
            horaFin={turno.horaFin}
            cliente={turno.cliente}
            servicio={turno.servicio}
            estado={turno.estado}
            onIniciar={() => iniciarTurno(turno.id)}
          />
        ))
      )}
    </div>
  );
}

export default ListaTurnos;
