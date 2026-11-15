import CardServicio from "../components/cardServicio/CardServicio";

export default function Servicios() {
    const servicios = [
        { id: 1, nombre: "CORTES", precio: 11000, descripcion: "Nuestro servicio insignia. Corte personalizado, lavado premium y peinado con productos de autor." },
        { id: 2, nombre: "BARBA", precio: 5000, descripcion: "Afeitado tradicional con toalla caliente y aceites esenciales para una barba impecable." },
        { id: 3, nombre: "CEJAS", precio: 5000, descripcion: "Perfilado y definición de cejas con navaja o pinza para un acabado impecable y natural." },
    ];
    
    return (
        <section className="container mt-5 text-white">
            <div className="text-center mb-5">
                <h2 className="fw-bold" style={{ color: '#d4af37', letterSpacing: '2px' }}>DESTACADOS</h2>
            </div>
            
            <div className="d-flex flex-column gap-4">
                {servicios.map((servicio) => (
                    <CardServicio key={servicio.id} servicio={servicio} />
                ))}
            </div>
        </section>
    );
}