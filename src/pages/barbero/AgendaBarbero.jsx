import { useState } from "react";
import CardAgendaTurno from "../../components/cardAgendaTurno/CardAgendaTurno.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import styles from "./AgendaBarbero.module.css";

// Convierte una fecha en texto "2026-11-22" para comparar días
const clave = (fecha) => fecha.toLocaleDateString("en-CA");

export default function AgendaBarbero() {
    const { usuario } = useAuth();
    const [fecha, setFecha] = useState(new Date());

    const [turnos, setTurnos] = useState([
        { id: 1, fecha: clave(new Date()), horaInicio: "10:00", horaFin: "10:45", cliente: "Lucas Gómez", servicio: "Corte de pelo", estado: "finalizado" },
        { id: 2, fecha: clave(new Date()), horaInicio: "11:00", horaFin: "11:30", cliente: "Matías Rojas", servicio: "Perfilado de barba", estado: "en_curso" },
        { id: 3, fecha: clave(new Date()), horaInicio: "12:00", horaFin: "13:00", cliente: "Nicolás Pérez", servicio: "Corte + barba", estado: "pendiente" },
    ]);

    function cambiarDia(cantidad) {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setDate(nuevaFecha.getDate() + cantidad);
        setFecha(nuevaFecha);
    }

    function registrarTurno(datos) {
        const nuevoTurno = {
            id: Date.now(),
            fecha: clave(fecha),
            ...datos,
            estado: "pendiente",
        };
        setTurnos([...turnos, nuevoTurno]);
    }

    function iniciarServicio(id) {
        const turnosActualizados = turnos.map((turno) =>
            turno.id === id ? { ...turno, estado: "en_curso" } : turno
        );
        setTurnos(turnosActualizados);
    }

    // Solo los turnos del día elegido, ordenados por hora
    const turnosDelDia = turnos
        .filter((turno) => turno.fecha === clave(fecha))
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    const barbero = {
        nombre: usuario || "Barbero",
        especialidad: "Barbero profesional",
        turnos: turnosDelDia,
    };

    return (
    <section data-bs-theme="dark">
        {/* Banner con la imagen y las frases adentro */}
        <div className={`${styles.banner} mb-4`}>
            <p className={styles.etiqueta}>PANEL DEL BARBERO</p>
            <h1 className={styles.titulo}>Mi agenda</h1>
            <p className={styles.subtitulo}>Consultá tus turnos y registrá nuevos.</p>
        </div>

        <CardAgendaTurno
            barbero={barbero}
            fecha={fecha}
            onCambiarDia={cambiarDia}
            onRegistrar={registrarTurno}
            onIniciar={iniciarServicio}
        />
    </section>
    );
}