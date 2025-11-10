import { routes } from "./routes";

export const getSiderBackground = (pathname: string) => {
    const loanRoutes = [
        routes.loan.enrollment,
        routes.loan.history,
        routes.loan.index,
    ];
    const savingsRoutes = [
        routes.savings.index,
        routes.savings.personal,
        routes.savings.cooperative,
    ];
    const withdrawalRoutes = [routes.withdrawal.index];
    const transactionRoutes = [routes.transactions.index];
    const notificationsRoutes = [routes.notifications.index];
    const settingsRoutes = [routes.settings.index];

    if (loanRoutes.some((route) => pathname.includes(route))) {
        return "linear-gradient(to bottom, #0F8ED4 0%, #0F87C9 70%, #0F5982 100%)";
    }

    if (savingsRoutes.some((route) => pathname.includes(route))) {
        return "linear-gradient(to bottom, #fff 0%, #63CC80 40%, #60C77C 100%)";
    }

    if (withdrawalRoutes.some((route) => pathname.includes(route))) {
        return "linear-gradient(to bottom, #fff 0%, #63CC80 40%, #60C77C 100%)";
    }

    if (transactionRoutes.some((route) => pathname.includes(route))) {
        return "linear-gradient(to bottom, #fff 0%, #63CC80 40%, #60C77C 100%)";
    }

    if (notificationsRoutes.some((route) => pathname.includes(route))) {
        return "linear-gradient(to bottom, #0F8ED4 0%, #0F87C9 70%, #0F5982 100%)";
    }

    if (settingsRoutes.some((route) => pathname.includes(route))) {
        return "linear-gradient(to bottom, #0F8ED4 0%, #0F87C9 70%, #0F5982 100%)";
    }

    return "#E4653F";
};
