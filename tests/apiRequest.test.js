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
