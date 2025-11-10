export const routes = {
    index: "/",
    auth: {
        register: {
            index: "/auth/register",
            civilian: "/auth/register/civilian",
            personnel: "/auth/register/personnel",
        },
        login: "/auth/login",
        forgotPassword: "/auth/forgot-password",
    },
    dashboard: {
        index: "/dashboard",
    },
    loan: {
        index: "/loan",
        enrollment: "/loan/enrollment",
        enrollment_status: "/loan/enrollment/status",
        history: "/loan/history",
        uploadpayment: "/loan/upload-payment",
    },
    savings: {
        index: "/savings",
        personal: "/savings/personal",
        cooperative: "/savings/cooperative",
    },
    withdrawal: {
        index: "/withdrawal",
    },
    transactions: {
        index: "/transactions",
    },
    notifications: {
        index: "/notifications",
    },
    settings: {
        index: "/settings"
    },
    payments: {
        index: "/payments",
        verify: "/payments/verify"
    }
};
