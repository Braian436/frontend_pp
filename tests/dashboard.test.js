import assert from "node:assert/strict";
import { test } from "node:test";
import {
    esCancelado,
    esCompletado,
    esPendiente,
    normalizarFilas,
    sumarMonto,
} from "../src/pages/administrador/dashboardData.js";

test("normaliza una lista API y calcula importes", () => {
    assert.deepEqual(normalizarFilas({ results: [{ id: 1 }] }, ["reservas"]), [{ id: 1 }]);
    assert.equal(sumarMonto({ monto: "12.500", pago: "500" }), 13000);
});

test("clasifica estados conocidos sin datos ficticios", () => {
    assert.equal(esPendiente("pendiente"), true);
    assert.equal(esCompletado("completado"), true);
    assert.equal(esCancelado("cancelado"), true);
});
