import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../../auth/useAuth.js";
import { rutaInicio } from "../../auth/sesion.js";
import AuthLayout from "../../components/authLayout/AuthLayout.jsx";
import LoginForm from "../../components/loginForm/LoginForm.jsx";

export default function Login() {
    const { autenticado, rol, login } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const destino = params.get("redirect");

    if (autenticado) {
        return <Navigate to={rutaInicio(rol)} replace />;
    }

    const ingresar = async (credenciales) => {
        const sesion = await login(credenciales);
        const inicio = rutaInicio(sesion.rol);
        const permitido = destino &&
            (destino === inicio || destino.startsWith(`${inicio}/`));
        navigate(permitido ? destino : inicio, { replace: true });
    };

    return (
        <AuthLayout>
            <LoginForm onIngresar={ingresar} />
        </AuthLayout>
    );
}
