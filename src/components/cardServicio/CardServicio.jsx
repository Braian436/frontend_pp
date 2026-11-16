import { Link } from "react-router-dom";

export default function CardServicio({ servicio }) {
    return (
        <div className="row g-0 border border-secondary rounded" style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
            
            <div className="col-md-5 d-flex align-items-center justify-content-center" style={{ minHeight: '200px', backgroundColor: '#2a2a2a' }}>
                <span className="text-secondary">Imagen próximamente</span>
            </div>
            
            <div className="col-md-7 p-4 d-flex flex-column justify-content-center">
                <h3 className="fw-bold mb-2" style={{ color: '#D9C493' }}>{servicio.nombre}</h3>
                <p className="text-secondary mb-4" style={{ lineHeight: '1.6' }}>{servicio.descripcion}</p>
                
                <div className="d-flex justify-content-between align-items-center">
                    
                    <span className="fw-bold" style={{ color: '#D9C493', fontSize: '1.2rem' }}>
                        ${servicio.precio}
                    </span>
                    
                    
                    <Link 
                        to="/registrar-turno" 
                        className="btn btn-sm rounded-pill px-4" 
                        style={{ backgroundColor: '#D9C493', color: '#000', fontWeight: 'bold' }}
                    >
                        Registrar Turno
                    </Link>
                </div>
            </div>
        </div>
    );
}