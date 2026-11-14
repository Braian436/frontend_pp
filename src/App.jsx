import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import { Routes, Route, useLocation } from "react-router-dom";
import styles from './App.module.css'
import Empleados from './pages/Empleados';
import ListaBarberos from './pages/ListaBarberos.jsx';
import Home from './pages/Home.jsx';
import HomeAdministrador from './pages/HomeAdministrador.jsx';
import TurnosDisponibles from './pages/TurnosDisponibles.jsx';


import NavbarAdministrador from './components/navbarAdministrador/NavbarAdministrador.jsx';

import AgendaBarberos from './pages/AgendaBarberos.jsx';


function App() {
  const { pathname } = useLocation();
  const esHomeAdministrador = pathname === "/admin";

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.app}`}>
      {esHomeAdministrador ? <NavbarAdministrador /> : <Navbar />}
      <main className={`flex-grow-1 w-100 ${styles.contenido}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<HomeAdministrador />} />
          <Route path="/servicios" element={<h1 className="container py-5 text-light">Servicios</h1>} />
          <Route path="/barberos" element={<ListaBarberos/>} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/registrar-turno" element={<ListaBarberos/>} />
          <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />
          <Route path="/agenda" element={<AgendaBarberos />} />
        </Routes>
      </main>
      {!esHomeAdministrador && <Footer />}
    </div>
  )
}

export default App
