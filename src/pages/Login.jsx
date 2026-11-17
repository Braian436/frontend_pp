import { Navigate } from "react-router-dom";
import AuthLayout from "../components/authLayout/AuthLayout.jsx";
import LoginForm from "../components/loginForm/LoginForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
    const { autenticado, iniciarSesion } = useAuth();

    if (autenticado) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <AuthLayout>
            <LoginForm onIngresar={iniciarSesion} />
        </AuthLayout>
    );
}
