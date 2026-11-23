import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Home from "./pages/cliente/Home.jsx";
import ListaBarberos from "./pages/cliente/ListaBarberos.jsx";
import TurnosDisponibles from "./pages/cliente/TurnosDisponibles.jsx";
import Servicios from "./pages/administrador/Servicios";
import Empleados from "./pages/administrador/Empleados.jsx";
import GestionProductos from "./pages/administrador/GestionProductos.jsx";
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
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/registrar-turno" element={<ListaBarberos />} />
                <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />
                <Route path="/admin" element={<HomeAdministrador />} />
                <Route path="/admin/empleados" element={<Empleados />} />
                <Route path="/admin/productos" element={<GestionProductos />} />
                <Route path="/admin/servicios" element={<Servicios administracion />} />
                <Route path="/home-barbero" element={<HomeBarber />} />
                <Route path="/home-barbero/agenda" element={<AgendaBarbero />} />
                <Route path="/cajero" element={<HomeCajero />} />
                <Route path="/cajero/caja" element={<CajaCajero />} />
                <Route path="/cajero/tickets" element={<TicketsCajero />} />
                <Route path="/cajero/servicios" element={<ServiciosCajero />} />
                        <Route
                            path="/empleados/"
                            element={
                                <ApiDataPage
                                    title="Empleados"
                                    description="Consulta el equipo registrado en la barbería."
                                    endpoint="/empleados/"
                                />
                            }
                        />
                        <Route
                            path="/liquidaciones/"
                            element={
                                <ApiDataPage
                                    title="Liquidaciones"
                                    description="Consulta las liquidaciones disponibles."
                                    endpoint="/liquidaciones/"
                                />
                            }
                        />
                        <Route
                            path="/turnos/disponibilidad/"
                            element={
                                <ApiDataPage
                                    title="Disponibilidad de turnos"
                                    description="Consulta los horarios disponibles de un empleado."
                                    endpoint="/turnos/disponibilidad/"
                                    requiereFiltros
                                />
                            }
                        />
                        <Route
                            path="/turnos/reservas/"
                            element={
                                <ApiDataPage
                                    title="Reservas"
                                    description="Consulta las reservas registradas."
                                    endpoint="/turnos/reservas/"
                                />
                            }
                        />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
