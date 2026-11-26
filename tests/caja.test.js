import assert from "node:assert/strict";
import { test } from "node:test";

import {
    calcularResumen,
    normalizarTicket,
} from "../src/pages/cajero/cajaData.js";

test("clasifica tickets anulados y cancelados", () => {
    const anulada = normalizarTicket({
        id_venta: 9,
        estado: true,
        anulada: true,
        subtotal: "100.00",
        descuento: "0.00",
        motivo_anulacion: "Cobro duplicado",
        anulada_por: "Gabicajero",
    });
    const cancelada = normalizarTicket({
        id_venta: 10,
        estado: false,
        anulada: true,
        subtotal: "50.00",
        motivo_anulacion: "Ticket duplicado",
    });

    assert.equal(anulada.estado, "anulada");
    assert.equal(anulada.motivoAnulacion, "Cobro duplicado");
    assert.equal(anulada.anuladaPor, "Gabicajero");
    assert.equal(cancelada.estado, "cancelada");
});

test("el resumen descuenta las anulaciones de la caja", () => {
    const resumen = calcularResumen(
        { saldoInicial: 1000 },
        [
            { tipo: "cobro", monto: 500, metodo: "efectivo" },
            { tipo: "anulacion", monto: 200, metodo: "efectivo", idVenta: 3 },
            { tipo: "egreso", monto: 100, metodo: "efectivo" },
        ],
        [
            { id: 1, estado: "pendiente", monto: 300 },
            { id: 2, estado: "cobrado", monto: 500 },
            { id: 3, estado: "anulada", monto: 200 },
        ]
    );

    assert.equal(resumen.ingresosBrutos, 500);
    assert.equal(resumen.anulaciones, 200);
    assert.equal(resumen.ingresos, 300);
    assert.equal(resumen.ingresosEfectivo, 300);
    assert.equal(resumen.efectivoEnCajon, 1200);
    assert.equal(resumen.cajaDelDia, 1200);
    assert.equal(resumen.totalAnulado, 200);
    assert.equal(resumen.ventasAnuladas.length, 1);
    assert.equal(resumen.pendientes.length, 1);
    assert.equal(resumen.cobrados.length, 1);
});
