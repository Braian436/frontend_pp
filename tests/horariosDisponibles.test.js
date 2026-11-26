import assert from "node:assert/strict";
import { test } from "node:test";
import {
    claveSlot,
    diasSinDomingo,
    horasReservables,
    momentoDelSlot,
} from "../src/pages/cliente/horariosDisponibles.js";

const ahora = new Date("2026-11-26T17:00:00-03:00");
const dia = "2026-11-26";
const horas = ["16:00", "17:04", "17:05", "18:00"];

test("sólo devuelve horarios libres con al menos 5 minutos de anticipación", () => {
    const disponibilidad = Object.fromEntries(
        horas.map((hora) => [claveSlot(dia, hora), true])
    );

    assert.deepEqual(
        horasReservables({ dia, horas, disponibilidad, ahora }),
        ["17:05", "18:00"]
    );
});

test("excluye horarios ocupados aunque tengan margen", () => {
    const disponibilidad = Object.fromEntries(
        horas.map((hora) => [claveSlot(dia, hora), true])
    );
    disponibilidad[claveSlot(dia, "18:00")] = false;

    assert.deepEqual(
        horasReservables({ dia, horas, disponibilidad, ahora }),
        ["17:05"]
    );
});

test("la grilla salta los domingos", () => {
    const desdeJueves = diasSinDomingo(new Date(2026, 10, 26));
    assert.deepEqual(desdeJueves.map((dia) => dia.getDay()), [4, 5, 6, 1, 2, 3]);

    const desdeDomingo = diasSinDomingo(new Date(2026, 10, 29));
    assert.deepEqual(desdeDomingo.map((dia) => dia.getDay()), [1, 2, 3, 4, 5, 6]);
});

test("interpreta los horarios en la zona de Salta", () => {
    assert.equal(
        momentoDelSlot(dia, "18:00").toISOString(),
        "2026-11-26T21:00:00.000Z"
    );
});
