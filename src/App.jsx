import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import { Routes, Route } from "react-router-dom";
import styles from './App.module.css'
import Empleados from './pages/Empleados';
import ListaBarberos from './pages/ListaBarberos.jsx';
import Home from './pages/Home.jsx';
import TurnosDisponibles from './pages/TurnosDisponibles.jsx';

function App() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.contenido}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<h1>Servicios</h1>} />
          <Route path="/barberos" element={<ListaBarberos/>} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/registrar-turno" element={<ListaBarberos/>} />
          <Route path="/turnos-disponibles" element={<TurnosDisponibles />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
