import assert from "node:assert/strict";
import { test } from "node:test";
import { construirEmpleado, construirProducto, construirServicio, extraerFilas, normalizarEmpleado, obtenerId, rutaDetalle, validarCatalogo } from "../src/pages/administrador/adminCrudHelpers.js";

test("extrae filas de respuestas directas o paginadas", () => {
    assert.deepEqual(extraerFilas({ results: [{ id: 1 }] }, "productos"), [{ id: 1 }]);
    assert.deepEqual(extraerFilas([{ id: 2 }], "productos"), [{ id: 2 }]);
});

test("obtiene el id de variantes comunes", () => {
    assert.equal(obtenerId({ pk: 7 }), "7");
    assert.equal(obtenerId({ id: 3 }), "3");
});

test("valida nombres y precios sin validaciones redundantes", () => {
    assert.equal(validarCatalogo({ nombre: "", precio: "-1" }), "Completá el nombre y un precio válido.");
    assert.equal(validarCatalogo({ nombre: "Corte", precio: "5000" }), "");
});

test("crea el payload de empleado con grupo", () => {
    assert.deepEqual(construirEmpleado({ nombre: "Ana", rol: "Barbero", dni: "12345678", comision: 15 }, false), {
        nombre: "Ana",
        rol: "Barbero",
        grupo: "Barbero",
        dni: "12345678",
        comision: 15,
    });

    test("construye payloads catalogo y rutas detalle REST", () => {
        assert.deepEqual(construirProducto({ nombre: "Cera", descripcion: "Fijación", precio: "8500", activo: "true" }), {
            nombre: "Cera", descripcion: "Fijación", precio: 8500, activo: true,
        });

        test("normaliza empleados anidados sin convertir objetos en texto de React", () => {
            const empleado = normalizarEmpleado({
                id: 4,
                username: "ana",
                user: { first_name: "Ana", dni: "12345678" },
                grupo: { name: "Barbero" },
                is_active: false,
            });
            assert.equal(empleado.id, "4");
            assert.equal(empleado.nombre, "Ana");
            assert.equal(empleado.dni, "12345678");
            assert.equal(empleado.rol, "Barbero");
            assert.equal(empleado.estado, "inactivo");
        });
        assert.deepEqual(construirServicio({ nombre: "Corte", descripcion: "Corte clásico", precio: "11000" }), {
            nombre: "Corte", descripcion: "Corte clásico", precio: 11000,
        });
        assert.equal(rutaDetalle("/productos/", "12"), "/productos/12/");
    });
});
