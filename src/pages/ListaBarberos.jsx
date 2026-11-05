import CardBarbero from "../components/cardBarbero/CardBarbero";
import styles from "./ListaBarberos.module.css";
import Logo from "../assets/LOGO-BARBER.png";

export default function ListaBarberos() {

    const barberos = [
    {
        id: 1,
        nombre: "Enzo Figueroa",
        especialidad: "Estilista",
        foto: Logo,
    },
    {
        id: 2,
        nombre: "Enzo Figueroa",
        especialidad: "Estilista",
        foto: Logo,
    },
    {
        id: 3,
        nombre: "Enzo Figueroa",
        especialidad: "Estilista",
        foto: Logo,
    },
    {
        id: 4,
        nombre: "Enzo Figueroa",
        especialidad: "Estilista",
        foto: Logo,
    },
    ];

    return (
        <section className={styles.seccion}>

            <div className={styles.contenedor}>

                {barberos.map((barbero) => (
                    <CardBarbero
                        key={barbero.id}
                        id={barbero.id}
                        nombre={barbero.nombre}
                        especialidad={barbero.especialidad}
                        foto={barbero.foto}
                    />
                ))}

            </div>

        </section>
    );
}