export const MARGEN_MINUTOS = 5;
export const HORAS_POR_PAGINA = 6;

// Los domingos están cerrados: se entregan 6 días hábiles desde `inicio`.
export function diasSinDomingo(inicio, cantidad = 6) {
    const dias = [];
    const fecha = new Date(inicio);
    while (dias.length < cantidad) {
        if (fecha.getDay() !== 0) dias.push(new Date(fecha));
        fecha.setDate(fecha.getDate() + 1);
    }
    return dias;
}

export function claveSlot(fecha, hora) {
    return `${fecha}T${String(hora).slice(0, 5)}`;
}

// Salta es UTC-3 todo el año: evitar depender de la zona del navegador.
export function momentoDelSlot(fecha, hora) {
    return new Date(`${claveSlot(fecha, hora)}:00-03:00`);
}

export function horasReservables({
    dia,
    horas = [],
    disponibilidad = {},
    ahora = new Date(),
    margenMinutos = MARGEN_MINUTOS,
}) {
    const limite = new Date(ahora.getTime() + margenMinutos * 60_000);
    return horas.filter((hora) => {
        if (disponibilidad[claveSlot(dia, hora)] !== true) return false;
        const momento = momentoDelSlot(dia, hora);
        return !Number.isNaN(momento.getTime()) && momento >= limite;
    });
}
