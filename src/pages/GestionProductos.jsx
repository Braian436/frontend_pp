import CardProducto from "../components/cardProducto/CardProducto";
import fondo from "../assets/adminproductos2.jpg";

export default function GestionProductos() {
    const productos = [
        { id: 1, nombre: "CERA FUERTE", descripcion: "Fijación extrema", precio: "8.500", activo: true },
        { id: 2, nombre: "ACEITE BARBA-BIGOTE", descripcion: "Gotero 30ml", precio: "17.500", activo: true },
        { id: 3, nombre: "SHAMPOO NEUTRO", descripcion: "Frasco 400ml", precio: "15.000", activo: false },
    ];

    const handleNuevoProducto = () => {
        alert("Próximamente: Formulario para agregar un nuevo producto.");
    };

    return (
        <section 
            className="container-fluid py-5 text-white" 
            style={{ 
                backgroundImage: `url(${fondo})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                backgroundBlendMode: 'overlay',
                minHeight: '100vh', 
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#D9C493' }}>Gestión de Productos</h2>
                    <button className="btn btn-outline-light rounded-pill px-4" onClick={handleNuevoProducto}>
                        + Nuevo Producto
                    </button>
                </div>
                
                <div className="row g-4">
                    {productos.map((prod) => (
                        <div className="col-12 col-md-6 col-lg-4" key={prod.id}>
                            {/* CAMBIO: antes era <CardProducto producto={prod} /> */}
                            <CardProducto
                                nombre={prod.nombre}
                                descripcion={prod.descripcion}
                                precio={prod.precio}
                                activo={prod.activo}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}