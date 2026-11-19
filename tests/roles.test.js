import assert from "node:assert/strict";
import { test } from "node:test";
import { menusPorGrupo, rutaInicialPorGrupo } from "../src/auth/roles.js";

test("each role links to its dashboard and available API routes", () => {
    assert.deepEqual(
        menusPorGrupo.Administrador.rutas.map(({ to }) => to),
        [
            "/admin",
            "/empleados/",
            "/liquidaciones/",
            "/turnos/disponibilidad/",
            "/turnos/reservas/",
        ]
    );
    assert.deepEqual(
        menusPorGrupo.Cajero.rutas.map(({ to }) => to),
        ["/turnos/reservas/"]
    );
    assert.deepEqual(
        menusPorGrupo.Barbero.rutas.map(({ to }) => to),
        [
            "/home-barbero",
            "/turnos/disponibilidad/",
            "/turnos/reservas/",
            "/liquidaciones/",
        ]
    );
    assert.deepEqual(rutaInicialPorGrupo, {
        Administrador: "/admin",
        Cajero: "/turnos/reservas/",
        Barbero: "/home-barbero",
    });
});

test("cashier modules without API endpoints remain visibly pending, not linked", () => {
    const pendientes = menusPorGrupo.Cajero.pendientes;

    assert.deepEqual(pendientes, [
        "Clientes",
        "Servicios",
        "Ventas",
        "Cajas",
        "Movimientos de caja",
        "Productos y stock",
    ]);
    assert.equal(pendientes.some((item) => item.to), false);
});
