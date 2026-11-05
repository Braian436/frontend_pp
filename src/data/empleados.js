export const ESTADOS = [
    {
        valor: "activo",
        etiqueta: "Activo",
        descripcion: "Trabajando actualmente",
    },
    {
        valor: "suspendido",
        etiqueta: "Suspendido",
        descripcion: "Pausa temporal",
    },
    {
        valor: "inactivo",
        etiqueta: "Inactivo",
        descripcion: "Fuera del equipo",
    },
];

export const ESTADOS_POR_VALOR = Object.fromEntries(
    ESTADOS.map((estado) => [estado.valor, estado])
);

export const EMPLEADOS_INICIALES = [
    {
        id: "emp-inicial-1",
        nombre: "Enzo Figueroa",
        foto: "",
        dni: "30123456",
        password: "barbero123",
        estado: "activo",
        comisiones: 15,
        fechaAlta: "2024-03-12T13:30:00.000Z",
    },
    {
        id: "emp-inicial-2",
        nombre: "Martín Acosta",
        foto: "",
        dni: "28555111",
        password: "barbero123",
        estado: "suspendido",
        comisiones: 10,
        fechaAlta: "2025-01-20T10:00:00.000Z",
    },
    {
        id: "emp-inicial-3",
        nombre: "Lucas Herrera",
        foto: "",
        dni: "35777888",
        password: "barbero123",
        estado: "inactivo",
        comisiones: 20,
        fechaAlta: "2023-08-05T15:45:00.000Z",
    },
];
