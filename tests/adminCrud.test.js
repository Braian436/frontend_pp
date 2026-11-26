import assert from "node:assert/strict";
import { test } from "node:test";
import {
    construirEmpleado,
    construirProducto,
    construirServicio,
    extraerFilas,
    normalizarEmpleado,
    obtenerId,
    rutaDetalle,
    validarCatalogo,
    validarCuentaEmpleado,
} from "../src/pages/administrador/adminCrudHelpers.js";

test("extrae filas de respuestas directas o paginadas", () => {
    assert.deepEqual(extraerFilas({ results: [{ id: 1 }] }, "productos"), [{ id: 1 }]);
    assert.deepEqual(extraerFilas([{ id: 2 }], "productos"), [{ id: 2 }]);
    assert.deepEqual(extraerFilas([{ id: 3, name: "Barberos" }], "groups"), [{ id: 3, name: "Barberos" }]);
});

test("obtiene el id de variantes comunes", () => {
    assert.equal(obtenerId({ pk: 7 }), "7");
    assert.equal(obtenerId({ id: 3 }), "3");
    assert.equal(obtenerId({ id_empleado: 8 }), "8");
});

test("valida nombres y precios sin validaciones redundantes", () => {
    assert.equal(validarCatalogo({ nombre: "", precio: "-1" }), "Completá el nombre y un precio válido.");
    assert.equal(validarCatalogo({ nombre: "Corte", precio: "5000" }), "");
});

test("crea empleados sin campos de cuenta cuando no se solicitan", () => {
    assert.deepEqual(construirEmpleado({
        nombre: "Ana",
        apellido: "Pérez",
        dni: "12345678",
        comision: "15",
        usuario: "",
        contrasena: "",
        grupoUsuario: "",
    }), {
        nombre: "Ana",
        apellido: "Pérez",
        dni: "12345678",
        porcentaje_comision: 15,
    });
});

test("incluye solo los datos de cuenta proporcionados en una edición parcial", () => {
    assert.deepEqual(construirEmpleado({
        nombre: "Ana",
        apellido: "Pérez",
        dni: "12345678",
        comision: 15,
        usuario: "ana",
        contrasena: "",
        grupoUsuario: "Barberos",
    }), {
        nombre: "Ana",
        apellido: "Pérez",
        dni: "12345678",
        porcentaje_comision: 15,
        usuario: "ana",
        grupo_usuario: "Barberos",
    });
});

test("omite la cuenta cuando no hay cambios informados", () => {
    const payload = construirEmpleado({
        nombre: "Ana",
        apellido: "Pérez",
        dni: "12345678",
        comision: 15,
        usuario: "",
        contrasena: "",
        grupoUsuario: "",
    });

    assert.equal("usuario" in payload, false);
    assert.equal("contrasena" in payload, false);
    assert.equal("grupo_usuario" in payload, false);
});

test("exige el conjunto completo de cuenta solo cuando el empleado aún no tiene cuenta", () => {
    assert.equal(validarCuentaEmpleado({}), "");
    assert.equal(validarCuentaEmpleado({ usuario: "ana" }), "Completá usuario, contraseña y grupo para crear la cuenta.");
    assert.equal(validarCuentaEmpleado({
        usuario: "ana",
        contrasena: "Clave!123",
        grupoUsuario: "Barberos",
    }), "");
    assert.equal(validarCuentaEmpleado({ usuario: "ana" }, true), "");
    assert.equal(validarCuentaEmpleado({ contrasena: "Nueva!123" }, true), "");
    assert.equal(validarCuentaEmpleado({ grupoUsuario: "Barberos" }, true), "");
});

test("normaliza el contrato de empleados del backend y su cuenta sin contraseña", () => {
    const empleado = normalizarEmpleado({
        id_empleado: 4,
        nombre: "Ana",
        apellido: "Lovelace",
        porcentaje_comision: "15.00",
        cuenta: { usuario: "ana", grupo: "Barberos" },
    });

    assert.equal(empleado.id, "4");
    assert.equal(empleado.nombre, "Ana");
    assert.equal(empleado.apellido, "Lovelace");
    assert.equal(empleado.usuario, "ana");
    assert.equal(empleado.grupoUsuario, "Barberos");
    assert.equal(empleado.tieneCuenta, true);
    assert.equal("contrasena" in empleado, false);
});

test("normaliza empleados sin cuenta sin inventar datos de cuenta", () => {
    const empleado = normalizarEmpleado({
        id_empleado: 5,
        nombre: "Grace",
        apellido: "Hopper",
        dni: "12345678",
        foto_empleado: "/grace.jpg",
        porcentaje_comision: "12.5",
        cuenta: null,
    });

    assert.equal(empleado.usuario, "");
    assert.equal(empleado.grupoUsuario, "");
    assert.equal(empleado.tieneCuenta, false);
    assert.equal("id_user" in empleado, false);
    assert.equal("rolId" in empleado, false);
});

test("construye payloads de catálogo y rutas detalle REST", () => {
    assert.deepEqual(construirServicio({
        nombre: "Corte",
        descripcion: "Corte clásico",
        precio: "11000",
    }), {
        nombre: "Corte",
        descripcion: "Corte clásico",
        precio: 11000,
    });
    assert.equal(rutaDetalle("/productos/", "12"), "/productos/12/");
});

test("construye payload de producto con stock, estado y relaciones", () => {
    assert.deepEqual(construirProducto({
        nombre: " Cera ",
        descripcion: "Fijación",
        stock_actual: "12",
        stock_minimo: "",
        estado: "true",
        id_marca: "2",
        id_categoria: "4",
        id_descuento: "5",
    }), {
        nombre: "Cera",
        descripcion: "Fijación",
        stock_actual: 12,
        stock_minimo: null,
        estado: true,
        id_marca: 2,
        id_categoria: 4,
        id_descuento: 5,
    });
});
