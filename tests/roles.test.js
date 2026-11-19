import assert from "node:assert/strict";
import { test } from "node:test";
import { menusPorGrupo, rutaInicialPorGrupo } from "../src/auth/roles.js";

test("each role only links to the API routes available for that group", () => {
    assert.deepEqual(
        menusPorGrupo.Administrador.rutas.map(({ to }) => to),
        [
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
            "/turnos/disponibilidad/",
            "/turnos/reservas/",
            "/liquidaciones/",
        ]
    );
    assert.deepEqual(rutaInicialPorGrupo, {
        Administrador: "/empleados/",
        Cajero: "/turnos/reservas/",
        Barbero: "/turnos/disponibilidad/",
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
