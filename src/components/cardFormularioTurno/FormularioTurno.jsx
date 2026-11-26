import { useState } from "react";
import styles from "./FormularioTurno.module.css";

export default function FormularioTurno({ fechaTexto, onGuardar, onCerrar, guardando = false }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [hora, setHora] = useState("");

  function enviar(e) {
    e.preventDefault();
    if (!completo || guardando) return;
    onGuardar({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono.trim(),
      hora,
    });
  }

  // El botón queda deshabilitado hasta completar todo
  const completo = nombre.trim() && apellido.trim() && telefono.trim() && hora;

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

        <div className={styles.horarios}>
          <label className={styles.campo}>
            Nombre
            <input
              type="text"
              className={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>
          <label className={styles.campo}>
            Apellido
            <input
              type="text"
              className={styles.input}
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.horarios}>
          <label className={styles.campo}>
            Teléfono
            <input
              type="tel"
              className={styles.input}
              placeholder="Teléfono del cliente"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </label>
          <label className={styles.campo}>
            Hora
            <input
              type="time"
              className={`${styles.input} ${styles.inputHora}`}
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
            />
          </label>
        </div>
        <p className={styles.ayuda}>Tocá el campo o el reloj para elegir la hora</p>

        <div className={styles.botones}>
          <button type="button" className={styles.cancelar} onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className={styles.guardar} disabled={!completo || guardando}>
            {guardando ? "Reservando..." : "Reservar"}
          </button>
        </div>
      </form>
    </div>
  );
}
