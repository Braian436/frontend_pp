import { useState } from "react";
import { createPortal } from "react-dom";
import SelectorServicio from "../selectorServicio/SelectorServicio.jsx";
import styles from "./FormularioTurno.module.css";

export default function FormularioTurno({ onGuardar, onCerrar }) {
    const [cliente, setCliente] = useState("");
    const [servicio, setServicio] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");

    function guardar(e) {
        e.preventDefault();
        onGuardar({ cliente, servicio, horaInicio, horaFin });
    }

    return createPortal(
        <div className={styles.fondo} data-bs-theme="dark" onClick={onCerrar}>
            <form
                className={styles.formulario}
                onSubmit={guardar}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="h5 text-white mb-3">Reservar turno</h3>

                <div className="row g-3">
                    <div className="col-12">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cliente"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <SelectorServicio valor={servicio} onCambiar={setServicio} />
                    </div>
                    <div className="col-6">
                        <label className="form-label text-white-50 small">Desde</label>
                        <input
                            type="time"
                            className="form-control"
                            value={horaInicio}
                            onChange={(e) => setHoraInicio(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label text-white-50 small">Hasta</label>
                        <input
                            type="time"
                            className="form-control"
                            value={horaFin}
                            onChange={(e) => setHoraFin(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className={styles.botonDorado} disabled={!servicio}>
                        GUARDAR TURNO
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                        Cerrar
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
}