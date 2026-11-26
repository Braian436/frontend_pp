import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { apiRequest } from "../../api/apiRequest.js";
import { useAuth } from "../../auth/useAuth.js";
import CardTurno from "../cardCardTurnoAgenda/CardTurno";
import FormularioTurno from "../cardFormularioTurno/FormularioTurno";
import {
  claveFecha,
  listarTurnosBarbero,
} from "../../pages/barbero/barberoApi.js";
import styles from "./ListaTurno.module.css";

const FILTROS = [
  { valor: "todos", texto: "todos" },
  { valor: "finalizado", texto: "finalizado" },
  { valor: "enCurso", texto: "en curso" },
  { valor: "pendiente", texto: "pendiente" },
];

export default function ListaTurno() {
  const { idEmpleado, nombre, usuario } = useAuth();
  const [params] = useSearchParams();
  const empleado = params.get("empleado") || idEmpleado || "";

  const [turnos, setTurnos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [fecha, setFecha] = useState(() => new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const fechaClave = claveFecha(fecha);

  const consultar = useCallback(
    (signal) => listarTurnosBarbero({ empleado, fecha: fechaClave, signal }),
    [empleado, fechaClave]
  );

  useEffect(() => {
    const controller = new AbortController();

    const cargar = async () => {
      if (!empleado) {
        setTurnos([]);
        setError("Tu usuario no tiene un barbero vinculado.");
        setCargando(false);
        return;
      }

      setCargando(true);
      setError("");
      try {
        setTurnos(await consultar(controller.signal));
      } catch (fallo) {
        if (fallo.name !== "AbortError") setError(fallo.message);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    void cargar();
    return () => controller.abort();
  }, [empleado, consultar]);

  const recargar = useCallback(async () => {
    if (!empleado) return;
    setCargando(true);
    setError("");
    try {
      setTurnos(await consultar());
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setCargando(false);
    }
  }, [empleado, consultar]);

  // Cambia la fecha sumando o restando días
  const cambiarDia = (dias) => {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + dias);
    setFecha(nueva);
  };

  // Pasa un turno de "pendiente" a "en curso" en el backend
  const iniciarTurno = async (id) => {
    setError("");
    try {
      await apiRequest(`/turnos/${id}/iniciar/`, { method: "POST" });
      await recargar();
    } catch (fallo) {
      setError(fallo.message);
    }
  };

  // Crea el turno en el backend y recarga el día
  const reservarTurno = async (datos) => {
    if (!empleado) return;
    setGuardando(true);
    setError("");
    try {
      await apiRequest("/turnos/reservas/", {
        method: "POST",
        body: {
          empleado,
          fecha: fechaClave,
          hora: datos.hora,
          nombre: datos.nombre,
          apellido: datos.apellido,
          telefono: datos.telefono,
        },
      });
      setMostrarFormulario(false);
      await recargar();
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setGuardando(false);
    }
  };

  const turnosDelDia = useMemo(
    () => [...turnos].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
    [turnos]
  );

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

  const nombreBarbero = nombre || usuario || "Barbero";
  const inicial = nombreBarbero.trim().charAt(0).toUpperCase() || "B";

  return (
    <section className={styles.contenedor}>
      {/* Encabezado del barbero */}
      <div className={styles.encabezado}>
        <div className={styles.perfil}>
          <div className={styles.avatar}>{inicial}</div>
          <div className="d-flex flex-column">
            <strong className={styles.nombre}>{nombreBarbero}</strong>
            <span className={styles.rol}>Barbero profesional</span>
          </div>
        </div>
        <button
          className={styles.botonReservar}
          onClick={() => setMostrarFormulario(true)}
          disabled={!empleado}
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
        {cargando && <p className={styles.vacio} role="status">Cargando turnos...</p>}
        {!cargando && error && <p className={styles.error} role="alert">{error}</p>}
        {!cargando && !error && turnosFiltrados.length === 0 ? (
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
          guardando={guardando}
          onGuardar={reservarTurno}
          onCerrar={() => setMostrarFormulario(false)}
        />
      )}
    </section>
  );
}
