import CardServicio from "../../components/cardServicio/CardServicio";
import fondo from "../../assets/fondoservicio1.jpg";
import { useState } from "react";
import AdminCatalogModal from "../../components/adminCatalogModal/AdminCatalogModal";
import styles from "./Empleados.module.css";
import { construirServicio, obtenerId, obtenerTexto, useCrudApi } from "./adminCrud";

const normalizar = (item) => ({
    id: obtenerId(item),
    nombre: obtenerTexto(item, ["nombre", "name"]),
    descripcion: obtenerTexto(item, ["descripcion", "description"]),
    precio: obtenerTexto(item, ["precio", "price"], ""),
});

export default function Servicios({ administracion = false }) {
    const crud = useCrudApi("/servicios/", "servicios");
    const [servicio, setServicio] = useState(null);
    const [abierto, setAbierto] = useState(false);
    const servicios = crud.items.map(normalizar);
    const campos = [
        { name: "nombre", label: "Nombre", required: true, value: "" },
        { name: "descripcion", label: "Descripción", value: "" },
        { name: "precio", label: "Precio", type: "number", min: 0, required: true, value: "" },
    ];
    const guardar = async (body) => {
        const payload = construirServicio(body);
        const ok = servicio ? await crud.editar(servicio, payload) : await crud.crear(payload);
        if (ok) setAbierto(false);
    };

    return (
        <section
            className={`container-fluid py-5 text-white ${administracion ? styles.pagina : ""}`}
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
                    {administracion && <p className={styles.subtitulo}>— PANEL DE ADMINISTRACIÓN</p>}
                    <h1 className={administracion ? styles.titulo : "fw-bold"} style={!administracion ? { color: '#D9C493', letterSpacing: '2px' } : undefined}>{administracion ? "Gestión de Servicios" : "DESTACADOS"}</h1>
                    {administracion && <button className={`btn ${styles.botonNuevo}`} onClick={() => { setServicio(null); setAbierto(true); }}>+ Nuevo servicio</button>}
                </div>
                {crud.loading && <p className="text-center text-secondary">Cargando servicios...</p>}
                {crud.error && <p className="text-danger text-center" role="alert">{crud.error}</p>}
                <div className="d-flex flex-column gap-4">
                    {servicios.map((servicio) => (
                        administracion ? (
                            <CardServicio key={servicio.id} nombre={servicio.nombre} descripcion={servicio.descripcion} precio={servicio.precio} administracion onEditar={() => { setServicio(servicio); setAbierto(true); }} onEliminar={() => window.confirm(`¿Eliminar ${servicio.nombre}?`) && crud.eliminar(servicio)} />
                        ) : <CardServicio key={servicio.id} nombre={servicio.nombre} descripcion={servicio.descripcion} precio={servicio.precio} />
                    ))}
                </div>
                {!crud.loading && !servicios.length && <p className="text-center text-secondary py-5">No hay servicios.</p>}
            </div>
            {abierto && <AdminCatalogModal titulo={servicio ? "Editar servicio" : "Nuevo servicio"} item={servicio} campos={campos} guardar={guardar} cerrar={() => setAbierto(false)} saving={crud.saving} error={crud.error} />}
        </section>
    );
}