import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/servicios/")
            .then((response) => {
                if (!response.ok) throw new Error("Error en la API");
                return response.json();
            })
            .then((data) => {
                const lista = Array.isArray(data) ? data : (data.results || []);
                setServicios(lista);
            })
            .catch((error) => {
                setServicios([
                    { id: 1, nombre: "CORTES", precio: 11000, descripcion: "Nuestro servicio insignia. Corte personalizado, lavado premium y peinado con productos de autor." },
                    { id: 2, nombre: "BARBA", precio: 5000, descripcion: "Afeitado tradicional con toalla caliente y aceites esenciales para una barba impecable." },
                    { id: 3, nombre: "CEJAS", precio: 5000, descripcion: "Perfilado y definición de cejas con navaja o pinza para un acabado impecable y natural." },
                ]);
            })
            .finally(() => setCargando(false));
    }, []);

    if (cargando) return <div className="text-center text-white mt-5">Cargando servicios...</div>;

    return (
        <section className="container mt-5 text-white">
            <div className="text-center mb-5">
                <h2 className="fw-bold" style={{ color: '#d4af37', letterSpacing: '2px' }}>DESTACADOS</h2>
            </div>
            
            <div className="d-flex flex-column gap-4">
                {servicios.map((servicio) => (
                    <div className="row g-0 border border-secondary rounded" key={servicio.id} style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
                        
                        <div className="col-md-5 d-flex align-items-center justify-content-center" style={{ minHeight: '200px', backgroundColor: '#2a2a2a' }}>
                            <span className="text-secondary">imagen</span>
                        </div>
                        
                        <div className="col-md-7 p-4 d-flex flex-column justify-content-center">
                            <h3 className="fw-bold mb-2" style={{ color: '#d4af37' }}>{servicio.nombre}</h3>
                            <p className="text-secondary mb-4" style={{ lineHeight: '1.6' }}>{servicio.descripcion}</p>
                            
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-warning fw-bold">${servicio.precio}</span>
                                <Link to="/registrar-turno" className="btn btn-outline-warning btn-sm rounded-pill px-4">
                                    Reservar
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}