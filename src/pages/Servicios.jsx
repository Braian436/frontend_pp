import CardServicio from "../components/cardServicio/CardServicio";
import fondo from "../assets/fondoservicio1.jpg";
import { useState } from "react";

const iniciales = [
    { id: 1, nombre: "CORTES", precio: 11000, descripcion: "Nuestro servicio insignia. Corte personalizado, lavado premium y peinado con productos de autor." },
    { id: 2, nombre: "BARBA", precio: 5000, descripcion: "Afeitado tradicional con toalla caliente y aceites esenciales para una barba impecable." },
    { id: 3, nombre: "CEJAS", precio: 5000, descripcion: "Perfilado y definición de cejas con navaja o pinza para un acabado impecable y natural." },
];

export default function Servicios({ administracion = false }) {
    const [servicios, setServicios] = useState(() => JSON.parse(localStorage.getItem("servicios") || "null") || iniciales);
    const guardar = (lista) => { localStorage.setItem("servicios", JSON.stringify(lista)); setServicios(lista); };
    const nuevo = () => {
        const nombre = prompt("Nombre del servicio:");
        const descripcion = nombre && prompt("Descripción:");
        const precio = descripcion && prompt("Precio:");
        if (!nombre || !descripcion || precio === null || !Number.isFinite(Number(precio)) || Number(precio) < 0) return alert("Completá nombre, descripción y precio válido.");
        guardar([...servicios, { id: Date.now(), nombre, descripcion, precio: Number(precio) }]);
    };
    const editar = (servicio) => {
        const nombre = prompt("Nombre:", servicio.nombre);
        const descripcion = nombre && prompt("Descripción:", servicio.descripcion);
        const precio = descripcion && prompt("Precio:", servicio.precio);
        if (!nombre || !descripcion || precio === null || !Number.isFinite(Number(precio)) || Number(precio) < 0) return alert("Completá nombre, descripción y precio válido.");
        guardar(servicios.map((item) => item.id === servicio.id ? { ...item, nombre, descripcion, precio: Number(precio) } : item));
    };

    return (
        <section
            className={`container-fluid py-5 text-white ${administracion ? "bg-dark" : ""}`}
            style={{
                backgroundImage: administracion ? "none" : `url(${fondo})`,
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                backgroundBlendMode: 'overlay'
            }}
        >
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ color: '#D9C493', letterSpacing: '2px' }}>{administracion ? "Gestión de Servicios" : "DESTACADOS"}</h2>
                    {administracion && <button className="btn btn-outline-light" onClick={nuevo}>+ Nuevo servicio</button>}
                </div>
                
                <div className="d-flex flex-column gap-4">
                    {servicios.map((servicio) => (
                        administracion ? (
                            <div className="card bg-dark text-white p-3" key={servicio.id}>
                                <h3>{servicio.nombre}</h3><p>{servicio.descripcion}</p><p>${servicio.precio}</p>
                                <div><button className="btn btn-outline-light me-2" onClick={() => editar(servicio)}>Editar</button><button className="btn btn-outline-danger" onClick={() => guardar(servicios.filter((item) => item.id !== servicio.id))}>Eliminar</button></div>
                            </div>
                        ) : <CardServicio key={servicio.id} nombre={servicio.nombre} descripcion={servicio.descripcion} precio={servicio.precio} />
                    ))}
                </div>
            </div>
        </section>
    );
}