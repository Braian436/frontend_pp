import { Navigate, Outlet, Routes, Route, useLocation } from "react-router-dom";
import styles from './App.module.css'
import Empleados from './pages/administrador/Empleados';
import ListaBarberos from './pages/cliente/ListaBarberos.jsx';
import Home from './pages/cliente/Home.jsx';
import TurnosDisponibles from './pages/cliente/TurnosDisponibles.jsx';
import Servicios from './pages/administrador/Servicios';
import HomeAdministrador from './pages/administrador/HomeAdministrador.jsx';
import NavbarAdministrador from './components/navbarAdministrador/NavbarAdministrador.jsx';
import HomeBarber from './pages/barbero/HomeBarber.jsx';
import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import GestionProductos from './pages/administrador/GestionProductos';
import Login from './pages/Login.jsx';
import { useAuth } from './auth/AuthContext.jsx';
import "@fontsource/montserrat"
import AgendaBarberos from "./pages/barbero/AgendaBarberos.jsx"

function Layout() {
  const { pathname } = useLocation();
  const esRutaAdministrador = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <div className={esRutaAdministrador ? styles.adminLayout : `d-flex flex-column min-vh-100 ${styles.app}`}>
      {esRutaAdministrador ? <NavbarAdministrador /> : <Navbar />}
      <main className={`flex-grow-1 w-100 ${styles.contenido}`}>
        <Outlet />
      </main>
      {!esRutaAdministrador && <Footer />}
    </div>
  )
}

function RutaPrivada() {
  const { autenticado } = useAuth();
  return autenticado ? <Outlet /> : <Navigate to="/login" replace />;
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
        <Route path="/agenda" element={<AgendaBarberos />} />
      </Route>

      {/* Todo lo que está acá adentro exige sesión iniciada. */}
      <Route element={<RutaPrivada />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<HomeAdministrador />} />
          <Route path="/admin/empleados" element={<Empleados />} />
          <Route path="/admin/productos" element={<GestionProductos />} />
          <Route path="/admin/servicios" element={<Servicios administracion />} />
          <Route path="/barberos" element={<ListaBarberos />} />
          <Route path="/empleados" element={<Navigate to="/admin/empleados" replace />} />
          <Route path="/home-barbero" element={<HomeBarber />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
