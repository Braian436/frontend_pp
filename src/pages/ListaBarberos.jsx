import { useState, useEffect } from "react"; // 1. Importamos useState y useEffect
import CardBarbero from "../components/cardBarbero/CardBarbero";
import styles from "./ListaBarberos.module.css";

export default function ListaBarberos() {
    // 2. Definimos el estado para guardar los barberos de la API (empieza vacío)
    const [barberos, setBarberos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 3. Ejecutamos la petición HTTP al cargar el componente
       useEffect(() => {
        fetch("http://localhost:8000/api/empleados/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then((data) => {
                
                const listaBarberos = Array.isArray(data) ? data : (data.results || []);
                setBarberos(listaBarberos); 
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al conectar con la API:", error);
                setCargando(false);
            });
    }, []);

    return (
        <section className={styles.seccion}>
            <div className={styles.contenedor}>
                {cargando ? (
                    <p>Cargando lista de barberos...</p>
                ) : barberos.length === 0 ? (
                    <p>No se encontraron barberos disponibles.</p>
                ) : (
                    barberos.map((barbero) => (
                        <CardBarbero
                            key={barbero.id_empleado}
                            id={barbero.id_empleado}
                            nombre={barbero.nombre_empleado}
                            especialidad={barbero.especialidad}
                            // Si la API no te da la URL completa de la imagen, descomenta la línea de abajo:
                            // foto={`http://localhost:8000${barbero.foto}`}
                            foto={barbero.foto_empleado} 
                        />
                    ))
                )}
            </div>
        </section>
    );
}
