import { createContext, useContext } from "react";

const CajaContext = createContext(null);

export function useCajaContext() {
    return useContext(CajaContext);
}

export default CajaContext;
