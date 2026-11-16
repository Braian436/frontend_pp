import { useState } from "react";

export default function CardProducto({ producto }) {
    const [activo, setActivo] = useState(producto.activo);

    const handleEditar = () => {
        alert(`Editando: ${producto.nombre}`);
    };

    const handleAgregarStock = () => {
        alert(`Agregando stock a: ${producto.nombre}`);
    };

    const handleToggleActivo = () => {
        setActivo(!activo);
    };

    return (
        <div className="card bg-dark text-white border-secondary rounded h-100" style={{ borderRadius: '20px' }}>
            
            <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#2a2a2a', minHeight: '120px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <span className="text-secondary">Foto</span>
            </div>
            
            <div className="card-body p-3 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#D9C493', fontSize: '1.1rem' }}>{producto.nombre}</h5>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activo ? '#28a745' : '#6c757d' }}></span>
                </div>
                
                <p className="text-secondary mb-2" style={{ fontSize: '0.8rem' }}>{producto.descripcion}</p>
                
                <div className="mb-3">
                    <span className="badge bg-secondary text-dark fw-bold px-3 py-2 rounded-pill">
                        ${producto.precio}
                    </span>
                </div>

                <div className="mt-auto">
                    <div className="d-flex gap-2 mb-3">
                        <button className="btn btn-sm btn-outline-light rounded-pill px-3 flex-grow-1" onClick={handleEditar}>
                            Editar
                        </button>
                        <button className="btn btn-sm rounded-pill px-3 flex-grow-1" style={{ backgroundColor: '#D9C493', color: '#000', fontWeight: 'bold' }} onClick={handleAgregarStock}>
                            Añadir Stock
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <div className="form-check form-switch m-0">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={activo} 
                                onChange={handleToggleActivo} 
                            />
                        </div>
                        <span className="fw-bold" style={{ color: activo ? '#D9C493' : '#6c757d' }}>
                            {activo ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}