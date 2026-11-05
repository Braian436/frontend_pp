import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import { Routes, Route } from "react-router-dom";
import styles from './App.module.css'
import ListaBarberos from './pages/ListaBarberos.jsx';
import Empleados from './pages/Empleados.jsx';
import EditarEmpleado from './pages/EditarEmpleado.jsx';

function App() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.contenido}>
        <Routes>
          <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/servicios" element={<h1>Servicios</h1>} />
          <Route path="/barberos" element={<ListaBarberos />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/empleados/editar/:id" element={<EditarEmpleado />} />
          <Route path="/registrar-turno" element={<h1>Registrar Turno</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
