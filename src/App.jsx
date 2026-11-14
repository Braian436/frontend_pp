import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import { Routes, Route } from "react-router-dom";
import styles from './App.module.css'
import Empleados from './pages/Empleados';
import ListaBarberos from './pages/ListaBarberos.jsx';
import Home from './pages/Home.jsx';
import TurnosDisponibles from './pages/TurnosDisponibles.jsx';
import Servicios from './pages/Servicios';
import HomeAdministrador from './pages/HomeAdministrador.jsx'; // <-- Braian agregó esto
import NavbarAdministrador from './components/navbarAdministrador/NavbarAdministrador.jsx'; // <-- Braian agregó esto

function App() {
  return (
    <div className={styles.app}>
      {/* Podés dejar el Navbar común para todas las rutas */}
      <Navbar />
      <main className={styles.contenido}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} /> {/* <-- TU RUTA */}
          <Route path="/barberos" element={<ListaBarberos/>} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/registrar-turno" element={<ListaBarberos/>} />
          <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />
          <Route path="/admin" element={<HomeAdministrador />} /> {/* <-- RUTA DE BRAIAN */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App