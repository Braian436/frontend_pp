
import { useState } from "react";
import SelectorServicio from "../C.SelectorServicio/SelectorServicio";
import styles from "./FormularioTurno.module.css";

export default function FormularioTurno({ fechaTexto, onGuardar, onCerrar }) {
  const [cliente, setCliente] = useState("");
  const [servicio, setServicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  function enviar(e) {
    e.preventDefault();
    onGuardar({ cliente, servicio, horaInicio, horaFin });
  }

  // El botón queda deshabilitado hasta completar todo
  const completo = cliente && servicio && horaInicio && horaFin;

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      {/* stopPropagation: así al hacer click dentro no se cierra */}
      <form
        className={styles.formulario}
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.titulo}>Reservar turno</h2>
        <p className={styles.fecha}>{fechaTexto}</p>

        <label className={styles.campo}>
          Cliente
          <input
            type="text"
            className={styles.input}
            placeholder="Nombre del cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
        </label>

        <div className={styles.campo}>
          Servicio
          <SelectorServicio valor={servicio} onCambiar={setServicio} />
        </div>

        <div className={styles.horarios}>
          <label className={styles.campo}>
            Desde
            <input
              type="time"
              className={`${styles.input} ${styles.inputHora}`}
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
            />
          </label>
          <label className={styles.campo}>
            Hasta
            <input
              type="time"
              className={`${styles.input} ${styles.inputHora}`}
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
            />
          </label>
        </div>
        <p className={styles.ayuda}>Tocá el campo o el reloj para elegir la hora</p>

        <div className={styles.botones}>
          <button type="button" className={styles.cancelar} onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className={styles.guardar} disabled={!completo}>
            Reservar
          </button>
        </div>
      </form>
    </div>
  );
}