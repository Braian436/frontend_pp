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
import AsistenciasCajero from "./pages/cajero/AsistenciasCajero.jsx";
import { CajaProvider } from "./pages/cajero/CajaProvider.jsx";
import CajaRequerida from "./pages/cajero/CajaRequerida.jsx";

function Layout() {
    const { pathname } = useLocation();
    const esCajero = pathname.startsWith("/cajero");
    const esPortal = pathname.startsWith("/admin") ||
        pathname.startsWith("/barbero") ||
        pathname.startsWith("/home-barbero") ||
        pathname.startsWith("/cajero") ||
        pathname.startsWith("/empleados") ||
        pathname.startsWith("/liquidaciones") ||
        pathname.startsWith("/turnos/disponibilidad") ||
        pathname.startsWith("/turnos/reservas");

    const contenido = (
        <>
            {esPortal ? <NavbarAdministrador /> : <Navbar />}
            <main className={`flex-grow-1 w-100 ${styles.contenido}`}>
                <Outlet />
            </main>
            {!esPortal && <Footer />}
        </>
    );

    return (
        <div
            className={
                esPortal
                    ? styles.adminLayout
                    : `d-flex flex-column min-vh-100 ${styles.app}`
            }
        >
            {esCajero ? (
                <CajaProvider>{contenido}</CajaProvider>
            ) : (
                contenido
            )}
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home/>}/>
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/registrar-turno" element={<ListaBarberos />} />
                <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />
                <Route path="/admin" element={<HomeAdministrador />} />
                <Route path="/admin/caja" element={<CajaCajero />} />
                <Route path="/admin/empleados" element={<Empleados />} />
                <Route path="/admin/productos" element={<GestionProductos />} />
                <Route path="/admin/marcas" element={<CatalogoProductos key="marcas" tipo="marcas" />} />
                <Route path="/admin/categorias" element={<CatalogoProductos key="categorias" tipo="categorias" />} />
                <Route path="/admin/descuentos" element={<CatalogoProductos key="descuentos" tipo="descuentos" />} />
                <Route path="/admin/compras" element={<Compras />} />
                <Route path="/admin/servicios" element={<Servicios administracion />} />
                <Route path="/admin/clientes" element={<Clientes />} />

                {/*Paginas de Barberos */}
                <Route path="/home-barbero" element={<HomeBarber />} />
                <Route path="/home-barbero/agenda" element={<AgendaBarbero />} />

                <Route path="/cajero" element={<HomeCajero />} />
                <Route
                    path="/cajero/caja"
                    element={
                        <CajaRequerida>
                            <CajaCajero />
                        </CajaRequerida>
                    }
                />
                <Route
                    path="/cajero/tickets"
                    element={
                        <CajaRequerida>
                            <TicketsCajero />
                        </CajaRequerida>
                    }
                />
                <Route
                    path="/cajero/servicios"
                    element={
                        <CajaRequerida>
                            <ServiciosCajero />
                        </CajaRequerida>
                    }
                />
                <Route
                    path="/cajero/asistencias"
                    element={
                        <CajaRequerida>
                            <AsistenciasCajero />
                        </CajaRequerida>
                    }
                />
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
