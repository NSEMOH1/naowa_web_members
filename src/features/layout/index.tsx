import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import SideBar from "../../components/sidebar/Sidebar";
import Loader from "../../components/loader";
import { routes } from "../../lib/routes";
import { useAuth } from "../../hooks/useAuth";

export default function MainLayout() {
    const location = useLocation();
    const { loading } = useAuth();

    if (
        [
            routes.auth.login,
            routes.auth.register.index,
            routes.auth.register.civilian,
            routes.auth.register.personnel,
            routes.index,
            routes.auth.forgotPassword
        ].includes(location.pathname)) {
        return (
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        );
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <SideBar>
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        </SideBar>
    );
}