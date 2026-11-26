import assert from "node:assert/strict";
import { test } from "node:test";
import { apiRequest } from "../src/api/apiRequest.js";

test("apiRequest muta sin sesión ni token CSRF", async (t) => {
    const fetchOriginal = globalThis.fetch;
    const documentOriginal = globalThis.document;
    t.after(() => {
        globalThis.fetch = fetchOriginal;
        if (documentOriginal === undefined) delete globalThis.document;
        else globalThis.document = documentOriginal;
    });

    delete globalThis.document;
    const solicitudes = [];
    globalThis.fetch = async (url, options) => {
        solicitudes.push({ url, options });
        return {
            ok: true,
            status: 204,
            text: async () => "",
        };
    };

    await apiRequest("/empleados/", {
        method: "POST",
        body: { nombre: "Ana" },
    });

    assert.equal(solicitudes.length, 1);
    assert.equal(solicitudes[0].options.credentials, "omit");
    assert.equal(solicitudes[0].options.headers.has("X-CSRFToken"), false);
});

test("las rutas públicas ignoran un token vencido guardado", async (t) => {
    const fetchOriginal = globalThis.fetch;
    const almacenOriginal = globalThis.localStorage;
    t.after(() => {
        globalThis.fetch = fetchOriginal;
        if (almacenOriginal === undefined) delete globalThis.localStorage;
        else globalThis.localStorage = almacenOriginal;
    });

    globalThis.localStorage = {
        getItem: (clave) => clave === "barberia:sesion"
            ? JSON.stringify({ token: "vencido" })
            : null,
        setItem: () => {},
        removeItem: () => {},
    };
    const autorizaciones = [];
    globalThis.fetch = async (url, options) => {
        autorizaciones.push(options.headers.get("Authorization"));
        return { ok: true, status: 200, text: async () => "{}" };
    };

    await apiRequest("/turnos/disponibilidad/?empleado=4");
    await apiRequest("/empleados/");

    assert.equal(autorizaciones[0], null);
    assert.equal(autorizaciones[1], "Token vencido");
});
