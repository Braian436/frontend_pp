import styles from "./ListaTurnos.module.css";
import TurnoResumen from "./TurnoResumen.jsx";

function ListaTurnos({ turnos = [], cargando = false, error = "" }) {
  return (
    <section className="d-flex flex-column gap-2">
      <h2 className={styles.titulo}>Próximos turnos</h2>
      {cargando && <p className={styles.aviso} role="status">Cargando turnos...</p>}
      {!cargando && error && <p className={styles.error} role="alert">{error}</p>}
      {!cargando && !error && turnos.length === 0 ? (
        <p className={styles.vacio}>No hay turnos próximos para hoy</p>
      ) : (
        turnos.map((turno) => (
          <TurnoResumen
            key={turno.id}
            horaInicio={turno.horaInicio}
            cliente={turno.cliente}
            servicio={turno.servicio}
          />
        ))
      )}
    </section>
  );
}

export default ListaTurnos;
