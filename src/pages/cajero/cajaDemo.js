// Datos de ejemplo con la misma forma que usan las páginas.
// Se mantiene un único objeto para que los cambios se conserven al navegar
// entre /cajero, /cajero/caja y /cajero/tickets mientras la API no exista.
export const demo = {
    caja: {
        id: 1,
        idEmpleado: 1,
        estado: "abierta",
        saldoInicial: 20000,
        saldoEsperado: null,
        saldoReal: null,
        diferencia: null,
        fechaInicio: "10:00",
        fechaCierre: null,
    },
    movimientos: [
        { id: 1, hora: "18:05", tipo: "propina", detalle: "Propinas del turno", monto: 9400, metodo: "efectivo" },
        { id: 2, hora: "17:30", tipo: "ingreso", detalle: "Ventas con tarjeta", monto: 68300, metodo: "tarjeta" },
        { id: 3, hora: "17:30", tipo: "ingreso", detalle: "Ventas en efectivo", monto: 75700, metodo: "efectivo" },
        { id: 4, hora: "16:30", tipo: "cobro", detalle: "Ticket de Bruno Díaz", monto: 8500, metodo: "efectivo" },
        { id: 5, hora: "15:10", tipo: "cobro", detalle: "Ticket de Julián Ríos", monto: 14000, metodo: "tarjeta" },
        { id: 6, hora: "10:00", tipo: "apertura", detalle: "Apertura de caja", monto: 20000, metodo: "efectivo" },
    ],
    tickets: [
        { id: 1, hora: "17:42", cliente: "Tomás Luna", barbero: "Mateo", servicios: "Corte + cejas", monto: 11200, estado: "pendiente", metodo: "" },
        { id: 2, hora: "17:01", cliente: "Pablo Vera", barbero: "Lucas", servicios: "Corte clásico", monto: 9500, estado: "pendiente", metodo: "" },
        { id: 3, hora: "16:30", cliente: "Bruno Díaz", barbero: "Enzo", servicios: "Corte clásico", monto: 8500, estado: "cobrado", metodo: "efectivo" },
        { id: 4, hora: "15:10", cliente: "Julián Ríos", barbero: "Martín", servicios: "Corte + barba", monto: 14000, estado: "cobrado", metodo: "tarjeta" },
    ],
    servicios: [
        { id: 1, nombre: "Corte clásico", descripcion: "Corte a tijera o máquina, lavado y peinado final.", precio: 11000 },
        { id: 2, nombre: "Corte + barba", descripcion: "Corte completo más perfilado de barba con toalla caliente.", precio: 16000 },
        { id: 3, nombre: "Perfilado de barba", descripcion: "Definición de contornos, recorte y aceites.", precio: 5000 },
        { id: 4, nombre: "Perfilado de cejas", descripcion: "Perfilado con navaja o pinza para un acabado natural.", precio: 5000 },
    ],
};
