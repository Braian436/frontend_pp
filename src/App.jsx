import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import styles from './App.module.css'
import Empleados from './pages/Empleados';
import ListaBarberos from './pages/ListaBarberos.jsx';
import Home from './pages/Home.jsx';
import HomeAdministrador from './pages/HomeAdministrador.jsx';
import TurnosDisponibles from './pages/TurnosDisponibles.jsx';
import HomeBarber from './pages/HomeBarber.jsx';
import NavbarAdministrador from './components/navbarAdministrador/NavbarAdministrador.jsx';

function App() {
  const { pathname } = useLocation();
  const esRutaAdministrador = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.app}`}>
      {esRutaAdministrador ? <NavbarAdministrador /> : <Navbar />}
      <main className={`flex-grow-1 w-100 ${styles.contenido}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<HomeAdministrador />} />
          <Route path="/admin/empleados" element={<Empleados />} />
          <Route path="/servicios" element={<h1 className="container py-5 text-light">Servicios</h1>} />
          <Route path="/barberos" element={<ListaBarberos/>} />
          <Route path="/empleados" element={<Navigate to="/admin/empleados" replace />} />
          <Route path="/registrar-turno" element={<ListaBarberos/>} />
          <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />
          <Route path="/home-barbero" element={<HomeBarber/>}/>
        </Routes>
      </main>
      {!esRutaAdministrador && <Footer />}
    </div>
  )
}

export default App
