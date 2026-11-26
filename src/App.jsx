import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Home from "./pages/cliente/Home.jsx";
import ListaBarberos from "./pages/cliente/ListaBarberos.jsx";
import TurnosDisponibles from "./pages/cliente/TurnosDisponibles.jsx";
import Servicios from "./pages/administrador/Servicios";
import Empleados from "./pages/administrador/Empleados.jsx";
import Clientes from "./pages/administrador/Clientes.jsx";
import Compras from "./pages/administrador/Compras.jsx";
import GestionProductos from "./pages/administrador/GestionProductos.jsx";
import CatalogoProductos from "./pages/administrador/CatalogoProductos.jsx";
import HomeAdministrador from "./pages/administrador/HomeAdministrador.jsx";
import HomeBarber from "./pages/barbero/HomeBarber.jsx";
import ApiDataPage from "./pages/apiData/ApiDataPage.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import NavbarAdministrador from "./components/navbarAdministrador/NavbarAdministrador.jsx";
import Footer from "./components/footer/Footer.jsx";
import "@fontsource/montserrat";
import AgendaBarbero from "./pages/barbero/AgendaBarbero.jsx";
import HomeCajero from "./pages/cajero/HomeCajero.jsx";
import CajaCajero from "./pages/cajero/CajaCajero.jsx";
import TicketsCajero from "./pages/cajero/TicketsCajero.jsx";
import ServiciosCajero from "./pages/cajero/ServiciosCajero.jsx";
import Login from "./pages/login/Login.jsx";
import RutaProtegida from "./components/rutaProtegida/RutaProtegida.jsx";

const ROLES_ADMIN = ["Administrador"];
const ROLES_BARBERO = ["Barbero"];
const ROLES_CAJERO = ["Cajero"];

function Layout() {
    const { pathname } = useLocation();
    const esPortal = pathname.startsWith("/admin") ||
        pathname.startsWith("/barbero") ||
        pathname.startsWith("/home-barbero") ||
        pathname.startsWith("/cajero") ||
        pathname.startsWith("/empleados") ||
        pathname.startsWith("/liquidaciones") ||
        pathname.startsWith("/turnos/disponibilidad") ||
        pathname.startsWith("/turnos/reservas");

    return (
        <div
            className={
                esPortal
                    ? styles.adminLayout
                    : `d-flex flex-column min-vh-100 ${styles.app}`
            }
        >
            {esPortal ? <NavbarAdministrador /> : <Navbar />}
            <main className={`flex-grow-1 w-100 ${styles.contenido}`}>
                <Outlet />
            </main>
            {!esPortal && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/registrar-turno" element={<ListaBarberos />} />
                <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />

                {/* Administrador */}
                <Route path="/admin" element={<RutaProtegida roles={ROLES_ADMIN}><HomeAdministrador /></RutaProtegida>} />
                <Route path="/admin/caja" element={<RutaProtegida roles={ROLES_ADMIN}><CajaCajero /></RutaProtegida>} />
                <Route path="/admin/empleados" element={<RutaProtegida roles={ROLES_ADMIN}><Empleados /></RutaProtegida>} />
                <Route path="/admin/productos" element={<RutaProtegida roles={ROLES_ADMIN}><GestionProductos /></RutaProtegida>} />
                <Route path="/admin/marcas" element={<RutaProtegida roles={ROLES_ADMIN}><CatalogoProductos key="marcas" tipo="marcas" /></RutaProtegida>} />
                <Route path="/admin/categorias" element={<RutaProtegida roles={ROLES_ADMIN}><CatalogoProductos key="categorias" tipo="categorias" /></RutaProtegida>} />
                <Route path="/admin/descuentos" element={<RutaProtegida roles={ROLES_ADMIN}><CatalogoProductos key="descuentos" tipo="descuentos" /></RutaProtegida>} />
                <Route path="/admin/compras" element={<RutaProtegida roles={ROLES_ADMIN}><Compras /></RutaProtegida>} />
                <Route path="/admin/servicios" element={<RutaProtegida roles={ROLES_ADMIN}><Servicios administracion /></RutaProtegida>} />
                <Route path="/admin/clientes" element={<RutaProtegida roles={ROLES_ADMIN}><Clientes /></RutaProtegida>} />

                {/* Barbero */}
                <Route path="/home-barbero" element={<RutaProtegida roles={ROLES_BARBERO}><HomeBarber /></RutaProtegida>} />
                <Route path="/home-barbero/agenda" element={<RutaProtegida roles={ROLES_BARBERO}><AgendaBarbero /></RutaProtegida>} />

                {/* Cajero */}
                <Route path="/cajero" element={<RutaProtegida roles={ROLES_CAJERO}><HomeCajero /></RutaProtegida>} />
                <Route path="/cajero/caja" element={<RutaProtegida roles={ROLES_CAJERO}><CajaCajero /></RutaProtegida>} />
                <Route path="/cajero/tickets" element={<RutaProtegida roles={ROLES_CAJERO}><TicketsCajero /></RutaProtegida>} />
                <Route path="/cajero/servicios" element={<RutaProtegida roles={ROLES_CAJERO}><ServiciosCajero /></RutaProtegida>} />

                {/* Consultas de API (solo administración) */}
                <Route
                    path="/empleados/"
                    element={
                        <RutaProtegida roles={ROLES_ADMIN}>
                            <ApiDataPage
                                title="Empleados"
                                description="Consulta el equipo registrado en la barbería."
                                endpoint="/empleados/"
                            />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/liquidaciones/"
                    element={
                        <RutaProtegida roles={ROLES_ADMIN}>
                            <ApiDataPage
                                title="Liquidaciones"
                                description="Consulta las liquidaciones disponibles."
                                endpoint="/liquidaciones/"
                            />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/turnos/disponibilidad/"
                    element={
                        <RutaProtegida roles={ROLES_ADMIN}>
                            <ApiDataPage
                                title="Disponibilidad de turnos"
                                description="Consulta los horarios disponibles de un empleado."
                                endpoint="/turnos/disponibilidad/"
                                requiereFiltros
                            />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/turnos/reservas/"
                    element={
                        <RutaProtegida roles={ROLES_ADMIN}>
                            <ApiDataPage
                                title="Reservas"
                                description="Consulta las reservas registradas."
                                endpoint="/turnos/reservas/"
                            />
                        </RutaProtegida>
                    }
                />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
