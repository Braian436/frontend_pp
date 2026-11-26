import { useState, useEffect } from "react";
import CardBarbero from "../../components/cardBarbero/CardBarbero";
import { apiRequest } from "../../api/apiRequest.js";
import styles from "./ListaBarberos.module.css";

export default function ListaBarberos() {
    const request = apiRequest;
    const [barberos, setBarberos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            try {
                const data = await request("/barberos/", {
                    signal: controller.signal,
                });
                setBarberos(
                    Array.isArray(data) ? data : (data?.results || [])
                );
            } catch (fallo) {
                if (fallo.name !== "AbortError") setError(fallo.message);
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };

        cargar();
        return () => controller.abort();
    }, [request]);

    return (
        <section className={styles.seccion}>
            <div className={`container ${styles.contenedor}`}>
                {cargando ? (
                    <p className="text-center text-light">Cargando lista de barberos...</p>
                ) : error ? (
                    <p className="text-center text-warning" role="alert">{error}</p>
                ) : barberos.length === 0 ? (
                    <p className="text-center text-light">No se encontraron barberos disponibles.</p>
                ) : (
                    <div className="row g-4">
                        {barberos.map((barbero) => (
                            <div className="col-12 col-lg-6" key={barbero.id_empleado}>
                                <CardBarbero
                                    id={barbero.id_empleado}
                                    nombre={
                                        barbero.nombre_empleado ||
                                        [barbero.nombre, barbero.apellido]
                                            .filter(Boolean)
                                            .join(" ")
                                    }
                                    especialidad={barbero.especialidad || "Barbero"}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
