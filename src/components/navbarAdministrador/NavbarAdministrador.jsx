import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LuBell, LuCircleAlert } from "react-icons/lu";
import styles from "./NavbarAdministrador.module.css";
import estilosCliente from "../navbar/Navbar.module.css";
import Logo from "../../assets/LOGO-BARBER.png";

const avisosStock = [
    { producto: "Cera mate", stock: 2, minimo: 5 },
    { producto: "Aceite para barba", stock: 3, minimo: 4 },
];

export default function NavbarAdministrador() {
    const [avisosAbiertos, setAvisosAbiertos] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <header className={`${estilosCliente.header} sticky-top`}>
            <nav className={`navbar navbar-expand-lg navbar-dark ${estilosCliente.navbar}`} aria-label="Navegación de administrador">
                <NavLink to="/admin" className="navbar-brand" aria-label="Inicio de administración">
                    <img src={Logo} alt="Barbería Clase A" className={estilosCliente.logoRedondo} />
                </NavLink>
                <button className="navbar-toggler border-secondary" type="button" aria-label="Abrir navegación" aria-controls="navegacion-admin" aria-expanded={menuAbierto} onClick={() => setMenuAbierto(!menuAbierto)}>
                    <span className="navbar-toggler-icon" />
                </button>
                <div id="navegacion-admin" className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">
                        <li className="nav-item"><NavLink to="/admin" end className={`nav-link ${estilosCliente.botonLindo}`} onClick={() => setMenuAbierto(false)}>INICIO</NavLink></li>
                        <li className="nav-item"><NavLink to="/empleados" className={`nav-link ${estilosCliente.botonLindo}`} onClick={() => setMenuAbierto(false)}>EMPLEADOS</NavLink></li>
                        <li className="nav-item"><NavLink to="/servicios" className={`nav-link ${estilosCliente.botonLindo}`} onClick={() => setMenuAbierto(false)}>SERVICIOS</NavLink></li>
                        <li className="nav-item"><a href="/admin#productos" className={`nav-link ${estilosCliente.botonLindo}`} onClick={() => setMenuAbierto(false)}>PRODUCTOS</a></li>
                        <li className="nav-item">
                            <div className="d-flex align-items-center gap-3">
                                <div className="position-relative">
                                    <button type="button" className={`btn d-inline-flex align-items-center justify-content-center position-relative p-2 ${styles.botonAvisos}`} aria-label={`${avisosStock.length} avisos de bajo stock`} aria-expanded={avisosAbiertos} aria-controls="avisos-stock" onClick={() => setAvisosAbiertos((abiertos) => !abiertos)}>
                                        <LuBell aria-hidden="true" />
                                        <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${styles.contador}`}>{avisosStock.length}</span>
                                    </button>
                                    {avisosAbiertos && <div id="avisos-stock" className={`position-absolute top-100 end-0 mt-2 p-3 shadow ${styles.panelAvisos}`}>
                                        <h2 className="mb-3">Avisos de stock</h2>
                                        {avisosStock.map((aviso) => <div key={aviso.producto} className={`d-flex align-items-start gap-2 py-2 ${styles.aviso}`}>
                                            <LuCircleAlert aria-hidden="true" />
                                            <p className="d-grid gap-1 mb-0"><strong>{aviso.producto}</strong><span>{aviso.stock} unidades · mínimo {aviso.minimo}</span></p>
                                        </div>)}
                                    </div>}
                                </div>
                                <NavLink to="/" className={`nav-link ${styles.cerrarSesion}`} onClick={() => setMenuAbierto(false)}>CERRAR SESIÓN</NavLink>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
