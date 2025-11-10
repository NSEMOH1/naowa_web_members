import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./loader";
import { routes } from "../lib/routes";
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return (
            <Navigate
                to={`${routes.index}?redirect=${encodeURIComponent(location.pathname)}`}
                replace
            />
        );
    }

    return <>{children}</>;
};