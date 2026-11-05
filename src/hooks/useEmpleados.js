import { useCallback, useState } from "react";
import {
    actualizarEmpleado,
    crearEmpleado,
    eliminarEmpleado,
    listarEmpleados,
} from "../services/empleados.js";

export default function useEmpleados() {
    const [empleados, setEmpleados] = useState(() => listarEmpleados());

    const refrescar = useCallback(() => {
        setEmpleados(listarEmpleados());
    }, []);

    const crear = useCallback((datos) => {
        const nuevo = crearEmpleado(datos);
        refrescar();
        return nuevo;
    }, [refrescar]);

    const actualizar = useCallback((id, datos) => {
        const actualizado = actualizarEmpleado(id, datos);
        refrescar();
        return actualizado;
    }, [refrescar]);

    const eliminar = useCallback((id) => {
        eliminarEmpleado(id);
        refrescar();
    }, [refrescar]);

    return { empleados, crear, actualizar, eliminar, refrescar };
}
