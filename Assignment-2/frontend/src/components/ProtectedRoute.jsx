import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
                                           children,
                                           allowedRoles
                                       }) {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.accountRole)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}