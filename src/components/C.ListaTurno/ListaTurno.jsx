import React, { useState } from "react";
import CardTurno from "../c.cardTurno/CardTurno";
import FormularioTurno from "../c.formularioTurno/FormularioTurno";
import styles from "./ListaTurno.module.css";

// Convierte una fecha a texto "2026-11-24" para poder comparar días
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

const FILTROS = [
  { valor: "todos", texto: "todos" },
  { valor: "finalizado", texto: "finalizado" },
  { valor: "enCurso", texto: "en curso" },
  { valor: "pendiente", texto: "pendiente" },
];

export default function ListaTurno() {
  const [turnos, setTurnos] = useState(LISTA_DE_TURNOS);
  const [filtro, setFiltro] = useState("todos");
  const [fecha, setFecha] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Cambia la fecha sumando o restando días
  const cambiarDia = (dias) => {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + dias);
    setFecha(nueva);
  };

  // Pasa un turno de "pendiente" a "enCurso"
  const iniciarTurno = (id) => {
    setTurnos(
      turnos.map((t) => (t.id === id ? { ...t, estado: "enCurso" } : t))
    );
  };

  // Agrega el turno nuevo (siempre queda pendiente) y cierra el formulario
  const reservarTurno = (datos) => {
    const nuevoTurno = {
      id: Date.now(),
      fecha: claveFecha(fecha),
      horaInicio: datos.horaInicio,
      horaFin: datos.horaFin,
      cliente: datos.cliente,
      servicio: datos.servicio,
      estado: "pendiente",
    };
    setTurnos([...turnos, nuevoTurno]);
    setMostrarFormulario(false);
  };

  // Solo los turnos del día que se está viendo, ordenados por hora
  const turnosDelDia = turnos
    .filter((t) => t.fecha === claveFecha(fecha))
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const contar = (valor) =>
    valor === "todos"
      ? turnosDelDia.length
      : turnosDelDia.filter((t) => t.estado === valor).length;

  const turnosFiltrados =
    filtro === "todos"
      ? turnosDelDia
      : turnosDelDia.filter((t) => t.estado === filtro);

  // "martes, 24 de noviembre de 2026" con la primera letra en mayúscula
  const textoLargo = fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const fechaTexto = textoLargo.charAt(0).toUpperCase() + textoLargo.slice(1);

  return (
    <section className={styles.contenedor}>
      {/* Encabezado del barbero */}
      <div className={styles.encabezado}>
        <div className={styles.perfil}>
          <div className={styles.avatar}>B</div>
          <div className="d-flex flex-column">
            <strong className={styles.nombre}>Barbero</strong>
            <span className={styles.rol}>Barbero profesional</span>
          </div>
        </div>
        <button
          className={styles.botonReservar}
          onClick={() => setMostrarFormulario(true)}
        >
          Reservar turno
        </button>
      </div>

      {/* Selector de fecha */}
      <div className={styles.selectorFecha}>
        <button className={styles.flecha} onClick={() => cambiarDia(-1)}>
          &lt;
        </button>
        <span className={styles.fecha}>{fechaTexto}</span>
        <button className={styles.flecha} onClick={() => cambiarDia(1)}>
          &gt;
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            className={`${styles.filtro} ${styles["filtro_" + f.valor]} ${
              filtro === f.valor ? styles.activo : ""
            }`}
            onClick={() => setFiltro(f.valor)}
          >
            {contar(f.valor)} {f.texto}
          </button>
        ))}
      </div>

      {/* Lista de turnos */}
      <div className="d-flex flex-column gap-2">
        {turnosFiltrados.length === 0 ? (
          <p className={styles.vacio}>No hay turnos para mostrar</p>
        ) : (
          turnosFiltrados.map((turno) => (
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

      {/* Formulario para reservar (solo se ve si está abierto) */}
      {mostrarFormulario && (
        <FormularioTurno
          fechaTexto={fechaTexto}
          onGuardar={reservarTurno}
          onCerrar={() => setMostrarFormulario(false)}
        />
      )}
    </section>
  );
}