import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import { Routes, Route } from "react-router-dom";
import styles from './App.module.css'
import Empleados from './pages/Empleados';


function App() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.contenido}>
        <Routes>
          <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/servicios" element={<h1>Servicios</h1>} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/registrar-turno" element={<h1>Registrar Turno</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
