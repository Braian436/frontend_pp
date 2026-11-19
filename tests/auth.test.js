import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
    apiRequest,
    login,
    logout,
    obtenerGrupo,
    sesionExpiradaPorError,
} from "../src/auth/auth.js";

const fetchOriginal = globalThis.fetch;

afterEach(() => {
    globalThis.fetch = fetchOriginal;
});

test("login obtains a token and loads the user's group with Token authorization", async () => {
    const llamadas = [];
    globalThis.fetch = async (url, options) => {
        llamadas.push({ url, options });
        const respuesta =
            llamadas.length === 1
                ? { token: "token-prueba" }
                : { username: "braian", groups: [{ name: "Barbero" }] };
        return Response.json(respuesta);
    };

    const sesion = await login({ username: "braian", password: "secreto" });

    assert.deepEqual(sesion, {
        token: "token-prueba",
        usuario: "braian",
        grupo: "Barbero",
    });
    assert.equal(llamadas[0].url, "http://localhost:8000/api/auth/token/");
    assert.equal(llamadas[0].options.method, "POST");
    assert.deepEqual(JSON.parse(llamadas[0].options.body), {
        username: "braian",
        password: "secreto",
    });
    assert.equal(llamadas[1].url, "http://localhost:8000/api/auth/me/");
    assert.equal(
        llamadas[1].options.headers.get("Authorization"),
        "Token token-prueba"
    );
});

test("apiRequest reports forbidden responses as access denied", async () => {
    globalThis.fetch = async () =>
        Response.json({ detail: "No autorizado" }, { status: 403 });

    await assert.rejects(
        apiRequest("/empleados/", "token-prueba"),
        { message: "Acceso denegado.", status: 403 }
    );
});

test("apiRequest identifies unauthorized responses for session expiry", async () => {
    globalThis.fetch = async () =>
        Response.json({ detail: "Token inválido" }, { status: 401 });

    await assert.rejects(apiRequest("/turnos/reservas/", "token-prueba"), {
        message: "La sesión expiró. Iniciá sesión nuevamente.",
        status: 401,
    });
});

test("unauthorized public requests do not count as an expired session", () => {
    assert.equal(sesionExpiradaPorError({ status: 401 }, null), false);
    assert.equal(sesionExpiradaPorError({ status: 401 }, "token-prueba"), true);
});

test("unauthorized public API responses are not described as an expired session", async () => {
    globalThis.fetch = async () =>
        Response.json(
            { detail: "No se permiten solicitudes anónimas." },
            { status: 401 }
        );

    await assert.rejects(apiRequest("/barberos/", null), {
        message: "No se permiten solicitudes anónimas.",
        status: 401,
    });
});

test("logout posts to the existing endpoint with the session token", async () => {
    let llamada;
    globalThis.fetch = async (url, options) => {
        llamada = { url, options };
        return new Response(null, { status: 204 });
    };

    await logout("token-prueba");

    assert.equal(llamada.url, "http://localhost:8000/api/auth/logout/");
    assert.equal(llamada.options.method, "POST");
    assert.equal(
        llamada.options.headers.get("Authorization"),
        "Token token-prueba"
    );
});

test("obtenerGrupo accepts a supported group from the me response", () => {
    assert.equal(obtenerGrupo({ user: { groups: ["Administrador"] } }), "Administrador");
    assert.equal(obtenerGrupo({ group: "Cajero" }), "Cajero");
    assert.equal(obtenerGrupo({ groups: ["Visitante"] }), null);
});
