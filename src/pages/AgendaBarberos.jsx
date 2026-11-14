import React from 'react'
import styles from './AgendaBarberos.module.css'

export default function AgendaBarberos() {
  return (
    <section className={styles.pagina}>
        <div className="container">
            <div className="row alingn-items-center g-3 mb-4">
                <div className="col-12 col-md-8">
                    <span className="{styles.subtitulo}">PANEL DE ADMINISTRACION</span>
                    <h1 className="{styles.titulo}">Agenda de Barberos</h1>
                    <p className="text-secondary mb-0">
                        Consulta los turnos y la disponibilidad de cada barbero.
                    </p>
                </div>
            </div>
        </div>
    </section>
    
  );
}
