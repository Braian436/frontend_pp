import { useEffect } from "react";
import {
    Navigate,
    Outlet,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";
import styles from "./App.module.css";
import Home from "./pages/cliente/Home.jsx";
import ListaBarberos from "./pages/cliente/ListaBarberos.jsx";
import TurnosDisponibles from "./pages/cliente/TurnosDisponibles.jsx";
import Servicios from "./pages/administrador/Servicios";
import Login from "./pages/Login.jsx";
import Empleados from "./pages/administrador/Empleados.jsx";
import GestionProductos from "./pages/administrador/GestionProductos.jsx";
import HomeAdministrador from "./pages/administrador/HomeAdministrador.jsx";
import HomeBarber from "./pages/barbero/HomeBarber.jsx";
import ApiDataPage from "./pages/apiData/ApiDataPage.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import { rutaInicialPorGrupo } from "./auth/roles.js";
import Navbar from "./components/navbar/Navbar.jsx";
import NavbarAdministrador from "./components/navbarAdministrador/NavbarAdministrador.jsx";
import Footer from "./components/footer/Footer.jsx";
import "@fontsource/montserrat";

const rutasInternas = [
    "/empleados/",
    "/liquidaciones/",
    "/turnos/disponibilidad/",
    "/turnos/reservas/",
];

function Layout() {
    const { pathname } = useLocation();
    const { grupo } = useAuth();
    const esPortal =
        grupo === "Administrador" &&
        (rutasInternas.includes(pathname) || pathname.startsWith("/admin"));

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

function RutaPrivada() {
    const { autenticado } = useAuth();
    return autenticado ? <Outlet /> : <Navigate to="/login" replace />;
}

function RutaPorGrupo({ grupoPermitido }) {
    const { grupo } = useAuth();
    return grupo === grupoPermitido
        ? <Outlet />
        : <Navigate to={rutaInicialPorGrupo[grupo] ?? "/"} replace />;
}

function RedireccionSesionExpirada() {
    const { sesionExpirada } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (sesionExpirada) navigate("/login", { replace: true });
    }, [navigate, sesionExpirada]);

    return null;
}

function App() {
    return (
        <>
            <RedireccionSesionExpirada />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/registrar-turno" element={<ListaBarberos />} />
                    <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />
                </Route>

                <Route element={<RutaPrivada />}>
                    <Route element={<Layout />}>
                        <Route element={<RutaPorGrupo grupoPermitido="Administrador" />}>
                            <Route path="/admin" element={<HomeAdministrador />} />
                            <Route path="/admin/empleados" element={<Empleados />} />
                            <Route path="/admin/productos" element={<GestionProductos />} />
                            <Route
                                path="/admin/servicios"
                                element={<Servicios administracion />}
                            />
                        </Route>
                        <Route element={<RutaPorGrupo grupoPermitido="Barbero" />}>
                            <Route path="/home-barbero" element={<HomeBarber />} />
                        </Route>
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
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
