import styles from './AgendaBarberos.module.css'
import { useState } from "react";
import AgendaCard from "../../components/agendaCard/AgendaCard";
import TurnoModal from "../../components/turnoModal/TurnoModal";

const barberosIniciales = [
  {
    id: 1,
    nombre: "Patricio Rosas",
    especialidad: "Estilista - Corte clásico y barba",
    turnos: [
      { id: 1, inicio: "10:00", fin: "10:45", cliente: "Lucas Gómez", servicio: "Corte de pelo", estado: "finalizado" },
      { id: 2, inicio: "11:00", fin: "11:30", cliente: "Matías Rojas", servicio: "Perfilado de barba", estado: "en_curso" },
      { id: 3, inicio: "12:00", fin: "13:00", cliente: "Nicolás Pérez", servicio: "Corte + barba", estado: "pendiente" },
    ],
  },
];

export default function AgendaBarberos() {
  const [barberos, setBarberos] = useState(barberosIniciales);
  const [barberoActivo, setBarberoActivo] = useState(null);

  const fecha = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Reservar: agrega un turno pendiente al barbero elegido
  const guardarTurno = (datos) => {
    const nuevo = { id: Date.now(), ...datos, estado: "pendiente" };

    setBarberos(
      barberos.map((b) =>
        b.id === barberoActivo.id ? { ...b, turnos: [...b.turnos, nuevo] } : b
      )
    );
    setBarberoActivo(null);
  };

  // El barbero solo usa "en_curso" y "cancelado".
  // "finalizado" lo marca el cajero.
  const cambiarEstado = (barberoId, turnoId, estado) => {
    const hora = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setBarberos(
      barberos.map((b) =>
        b.id !== barberoId
          ? b
          : {
              ...b,
              turnos: b.turnos.map((t) =>
                t.id !== turnoId
                  ? t
                  : {
                      ...t,
                      estado,
                      horaCancelacion: estado === "cancelado" ? hora : undefined,
                    }
              ),
            }
      )
    );
  };

  return (
    <section className={styles.pagina}>
      <div className="container">
        <div className="mb-4">
          <span className={styles.subtitulo}>Panel de administración</span>
          <h1 className={styles.titulo}>Agenda de Barberos</h1>
          <p className="text-secondary mb-0">
            Consulta los turnos y la disponibilidad de cada barbero.
          </p>
        </div>

        {barberos.map((barbero) => (
          <AgendaCard
            key={barbero.id}
            barbero={barbero}
            fecha={fecha}
            onReservar={setBarberoActivo}
            onCambiarEstado={cambiarEstado}
          />
        ))}
      </div>

      {barberoActivo && (
        <TurnoModal
          barbero={barberoActivo}
          cerrar={() => setBarberoActivo(null)}
          guardar={guardarTurno}
        />
      )}
    </section>
  );
}