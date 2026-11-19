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
            { label: "Inicio", to: "/admin", icon: "home" },
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
            { label: "Inicio", to: "/home-barbero", icon: "home" },
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
    Administrador: "/admin",
    Cajero: "/turnos/reservas/",
    Barbero: "/home-barbero",
};
