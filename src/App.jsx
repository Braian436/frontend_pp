import { useState } from 'react'
import Navbar from './components/navbar/Navbar.jsx'
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/servicios" element={<h1>Servicios</h1>} />
        <Route path="/barberos" element={<h1>Barberos</h1>} />
        <Route path="/registrar-turno" element={<h1>Registrar Turno</h1>} />
      </Routes>
    </>
  )
}

export default App
