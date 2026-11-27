import { useState } from "react";
import styles from "./AdminCatalogModal.module.css";

export default function AdminCatalogModal({ titulo, item, campos, guardar, cerrar, saving, error: apiError }) {
    const [form, setForm] = useState(() => Object.fromEntries(campos.map(({ name, value, options, multiple }) => {
        const inicial = item?.[name] ?? item?.[value] ?? value;
        if (multiple) return [name, Array.isArray(inicial) ? inicial.map(String) : []];
        return [name, options ? String(inicial) : inicial];
    })));
    const [error, setError] = useState("");

    const toggleMulti = (name, val) => setForm((prev) => {
        const actuales = prev[name] ?? [];
        return { ...prev, [name]: actuales.includes(val) ? actuales.filter((x) => x !== val) : [...actuales, val] };
    });

    const submit = (evento) => {
        evento.preventDefault();
        for (const campo of campos) {
            if (campo.required && (campo.multiple ? !form[campo.name]?.length : String(form[campo.name] ?? "").trim() === "")) {
                setError(`Completá ${campo.label.toLowerCase()}.`);
                return;
            }
            if (campo.min !== undefined && (Number.isNaN(Number(form[campo.name])) || Number(form[campo.name]) < campo.min)) {
                setError(`${campo.label} debe ser válido.`);
                return;
            }
        }
        setError("");
        guardar(form);
    };

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="catalogo-modal-title">
            <div className={`modal show d-block ${styles.modal}`}>
                <div className={`modal-dialog modal-dialog-centered ${styles.dialogo}`}>
                    <form className={`modal-content ${styles.contenido}`} onSubmit={submit}>
                        <div className={`modal-header ${styles.header}`}>
                            <h2 id="catalogo-modal-title" className="modal-title fs-5">{titulo}</h2>
                            <button type="button" className="btn-close btn-close-white" onClick={cerrar} aria-label="Cerrar" />
                        </div>
                        <div className={`modal-body scrollbar-app ${styles.cuerpo}`}>
                            {campos.map((campo) => (
                                <div className="mb-3" key={campo.name}>
                                    <label className="form-label" htmlFor={`catalogo-${campo.name}`}>{campo.label}</label>
                                    {campo.multiple ? (
                                        <div className={styles.multiLista}>
                                            {campo.options.length ? campo.options.map((option) => {
                                                const val = String(typeof option === "object" ? option.value : option);
                                                const lbl = typeof option === "object" ? option.label : option;
                                                const activo = form[campo.name]?.includes(val);
                                                return (
                                                    <label key={val} className={`${styles.multiItem} ${activo ? styles.multiItemActivo : ""}`}>
                                                        <input type="checkbox" checked={activo} onChange={() => toggleMulti(campo.name, val)} />
                                                        <span>{lbl}</span>
                                                    </label>
                                                );
                                            }) : <span className={styles.vacio}>Sin opciones disponibles</span>}
                                        </div>
                                    ) : campo.options ? (
                                        <select id={`catalogo-${campo.name}`} className={`form-select ${styles.input}`} value={form[campo.name]} onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}>
                                            <option value="">Seleccionar...</option>
                                            {campo.options.map((option) => (
                                                <option key={typeof option === "object" ? option.value : option} value={typeof option === "object" ? option.value : option}>
                                                    {typeof option === "object" ? option.label : option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input id={`catalogo-${campo.name}`} className={`form-control ${styles.input}`} type={campo.type || "text"} min={campo.min} step={campo.step} value={form[campo.name]} onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })} required={campo.required} />
                                    )}
                                </div>
                            ))}
                            {error && <p className={styles.error} role="alert">{error}</p>}
                            {apiError && <p className={styles.error} role="alert">{apiError}</p>}
                        </div>
                        <div className={`modal-footer ${styles.footer}`}>
                            <button type="button" className={`btn ${styles.cancelar}`} onClick={cerrar}>Cancelar</button>
                            <button type="submit" className={`btn ${styles.guardar}`} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
