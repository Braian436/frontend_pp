import CardServicio from "../components/cardServicio/CardServicio";
import fondo from "../assets/fondoservicio1.jpg"; 

export default function Servicios() {
    const servicios = [
        { id: 1, nombre: "CORTES", precio: 11000, descripcion: "Nuestro servicio insignia. Corte personalizado, lavado premium y peinado con productos de autor." },
        { id: 2, nombre: "BARBA", precio: 5000, descripcion: "Afeitado tradicional con toalla caliente y aceites esenciales para una barba impecable." },
        { id: 3, nombre: "CEJAS", precio: 5000, descripcion: "Perfilado y definición de cejas con navaja o pinza para un acabado impecable y natural." },
    ];
    
    return (
        <section 
            className="container-fluid py-5 text-white" 
            style={{ 
                backgroundImage: `url(${fondo})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                backgroundBlendMode: 'overlay'
            }}
        >
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ color: '#D9C493', letterSpacing: '2px' }}>DESTACADOS</h2>
                </div>
                
                <div className="d-flex flex-column gap-4">
                    {servicios.map((servicio) => (
                        <CardServicio key={servicio.id} servicio={servicio} />
                    ))}
                </div>
            </div>
        </section>
    );
}