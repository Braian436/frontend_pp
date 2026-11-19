const pendientesCaja = [
    "Clientes",
    "Servicios",
    "Ventas",
    "Cajas",
    "Movimientos de caja",
    "Productos y stock",
];

export const menusPorGrupo = {
    Administrador: {
        rutas: [
            { label: "Empleados", to: "/empleados/", icon: "users" },
            { label: "Liquidaciones", to: "/liquidaciones/", icon: "receipt" },
            {
                label: "Disponibilidad",
                to: "/turnos/disponibilidad/",
                icon: "calendar",
            },
            { label: "Reservas", to: "/turnos/reservas/", icon: "scissors" },
        ],
        pendientes: pendientesCaja,
    },
    Cajero: {
        rutas: [{ label: "Turnos", to: "/turnos/reservas/", icon: "calendar" }],
        pendientes: pendientesCaja,
    },
    Barbero: {
        rutas: [
            {
                label: "Disponibilidad",
                to: "/turnos/disponibilidad/",
                icon: "calendar",
            },
            { label: "Reservas", to: "/turnos/reservas/", icon: "scissors" },
            { label: "Liquidaciones", to: "/liquidaciones/", icon: "receipt" },
        ],
        pendientes: [],
    },
};

export const rutaInicialPorGrupo = {
    Administrador: "/empleados/",
    Cajero: "/turnos/reservas/",
    Barbero: "/turnos/disponibilidad/",
};
