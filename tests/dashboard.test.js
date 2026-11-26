import assert from "node:assert/strict";
import { test } from "node:test";
import {
    construirUrlDashboard,
    esCancelado,
    esCompletado,
    esPendiente,
    normalizarFilas,
    sumarMonto,
} from "../src/pages/administrador/dashboardData.js";
import { obtenerAvisosStock } from "../src/components/navbarAdministrador/stockNotifications.js";

test("normaliza una lista API y calcula importes", () => {
    assert.deepEqual(normalizarFilas({ results: [{ id: 1 }] }, ["reservas"]), [{ id: 1 }]);
    assert.equal(sumarMonto({ monto: "12.500", pago: "500" }), 13000);
});

test("construye la consulta del resumen con la fecha elegida para cada gráfico", () => {
    assert.equal(
        construirUrlDashboard({
            fechaCaja: "2026-11-19",
            fechaBarberos: "2026-11-18",
            fechaCortes: "2026-11-17",
        }),
        "/dashboard/administrador/?fecha_caja=2026-11-19&fecha_barberos=2026-11-18&fecha_cortes=2026-11-17",
    );
});

test("clasifica estados conocidos sin datos ficticios", () => {
    assert.equal(esPendiente("pendiente"), true);
    assert.equal(esCompletado("completado"), true);
    assert.equal(esCancelado("cancelado"), true);
});

test("detecta productos cuyo stock está por debajo del mínimo", () => {
    assert.deepEqual(obtenerAvisosStock([
        { nombre: "Cera", stock_actual: 2, stock_minimo: 5 },
        { nombre: "Aceite", stock_actual: 5, stock_minimo: 5 },
        { nombre: "Peine", stock_actual: 1, stock_minimo: null },
    ]), [
        { producto: "Cera", stock: 2, minimo: 5 },
    ]);
});
