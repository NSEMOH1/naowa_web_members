import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { routes } from "../lib/routes";
import Loader from "../components/loader";
import { ProtectedRoute } from "../components/protectedRoutes.tsx";

const Dashboard = lazy(() => import("../pages/dashboard"));
const Login = lazy(() => import("../pages/auth/login/index.tsx"));
const Register = lazy(() => import("../pages/auth/register/index.tsx"));
const Loan = lazy(() => import("../pages/loan/index.tsx"));
const Savings = lazy(() => import("../pages/savings/index.tsx"));
const Transaction = lazy(() => import("../pages/transactions/index.tsx"));
const Withdrawal = lazy(() => import("../pages/withdrawal/index.tsx"));
const ForgotPassword = lazy(
  () => import("../pages/auth/forgot-password/index.tsx")
);
const CivilianRegisteration = lazy(
  () => import("../pages/auth/register/civilian/index.tsx")
);
const PersonelRegisteration = lazy(
  () => import("../pages/auth/register/personel/index.tsx")
);
const LoanEnrollment = lazy(() => import("../pages/loan/enrollment/index.tsx"));
const LoanHistory = lazy(() => import("../pages/loan/history/index.tsx"));
const CooperativeSavings = lazy(
  () => import("../pages/savings/cooperative/index.tsx")
);
const PersonalSavings = lazy(
  () => import("../pages/savings/personal/index.tsx")
);
const UploadPayment = lazy(
  () => import("../pages/loan/upload-payment/index.tsx")
);
const Notifications = lazy(() => import("../pages/notifications/index.tsx"));
const Settings = lazy(() => import("../pages/settings/index.tsx"));
const Payments = lazy(() => import("../pages/payments/index.tsx"));
const PaymentsVerification = lazy(
  () => import("../pages/payments/verification.tsx")
);
const LoanEnrollmentStatus = lazy(
  () => import("../pages/loan/enrollment/status.tsx")
);

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
}

const coopRoutesConfig: RouteConfig[] = [
  {
    path: routes.index,
    element: <Login />,
  },
  {
    path: routes.dashboard.index,
    element: <Dashboard />,
    protected: true,
  },
  {
    path: routes.auth.register.index,
    element: <Register />,
  },
  {
    path: routes.auth.register.civilian,
    element: <CivilianRegisteration />,
  },
  {
    path: routes.auth.register.personnel,
    element: <PersonelRegisteration />,
  },
  {
    path: routes.loan.index,
    element: <Loan />,
    protected: true,
  },
  {
    path: routes.savings.index,
    element: <Savings />,
    protected: true,
  },
  {
    path: routes.transactions.index,
    element: <Transaction />,
    protected: true,
  },
  {
    path: routes.withdrawal.index,
    element: <Withdrawal />,
    protected: true,
  },
  {
    path: routes.auth.forgotPassword,
    element: <ForgotPassword />,
  },
  {
    path: routes.loan.enrollment,
    element: <LoanEnrollment />,
    protected: true,
  },
  {
    path: routes.loan.history,
    element: <LoanHistory />,
    protected: true,
  },
  {
    path: routes.savings.cooperative,
    element: <CooperativeSavings />,
    protected: true,
  },
  {
    path: routes.savings.personal,
    element: <PersonalSavings />,
    protected: true,
  },
  {
    path: routes.loan.uploadpayment,
    element: <UploadPayment />,
    protected: true,
  },
  {
    path: routes.notifications.index,
    element: <Notifications />,
    protected: true,
  },
  {
    path: routes.payments.index,
    element: <Payments />,
    protected: true,
  },
  {
    path: routes.payments.verify,
    element: <PaymentsVerification />,
    protected: true,
  },
  {
    path: routes.settings.index,
    element: <Settings />,
    protected: true,
  },
  {
    path: routes.loan.enrollment_status,
    element: <LoanEnrollmentStatus />,
    protected: true,
  },
];

export const CoopRoutes = () => {
  return (
    <>
      {coopRoutesConfig.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<Loader />}>
              {route.protected ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )}
            </Suspense>
          }
        />
      ))}
    </>
  );
};
