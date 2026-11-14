import { useState } from "react";
import styles from "./TurnoModal.module.css";

export default function TurnoModal({ barbero, cerrar, guardar }) {
  const [cliente, setCliente] = useState("");
  const [servicio, setServicio] = useState("Corte de pelo");
  const [inicio, setInicio] = useState("10:00");
  const [fin, setFin] = useState("10:30");
  const [error, setError] = useState("");

  const enviar = (e) => {
    e.preventDefault();

    if (fin <= inicio) {
      setError("La hora de fin debe ser posterior a la de inicio.");
      return;
    }

    guardar({ cliente, servicio, inicio, fin });
  };

  return (
    <div className={`modal d-block ${styles.fondo}`}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <form className="modal-content bg-dark text-white" onSubmit={enviar}>
          <div className="modal-header border-secondary">
            <h5 className="modal-title">Reservar turno - {barbero.nombre}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={cerrar}
            />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Cliente</label>
              <input
                type="text"
                className="form-control"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Servicio</label>
              <select
                className="form-select"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
              >
                <option>Corte de pelo</option>
                <option>Perfilado de barba</option>
                <option>Corte + barba</option>
              </select>
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label">Inicio</label>
                <input
                  type="time"
                  className="form-control"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label">Fin</label>
                <input
                  type="time"
                  className="form-control"
                  value={fin}
                  onChange={(e) => setFin(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-danger mt-3 mb-0">{error}</p>}
          </div>

          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-outline-light" onClick={cerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-warning">
              Reservar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}