import { Navigate } from "react-router-dom";
import AuthLayout from "../components/authLayout/AuthLayout.jsx";
import LoginForm from "../components/loginForm/LoginForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { rutaInicialPorGrupo } from "../auth/roles.js";

export default function Login() {
    const { autenticado, grupo, aviso, iniciarSesion } = useAuth();

    if (autenticado) {
        return <Navigate to={rutaInicialPorGrupo[grupo] ?? "/"} replace />;
    }

    return (
        <AuthLayout>
            <LoginForm onIngresar={iniciarSesion} aviso={aviso} />
        </AuthLayout>
    );
}
