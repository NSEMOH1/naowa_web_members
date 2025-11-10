import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { CoopRoutes } from "./routes";
import MainLayout from "./features/layout";
import "react-datepicker/dist/react-datepicker.css";
import { setupInterceptors } from "./api";
import { useEffect } from "react";
import { useCookie } from "./hooks/useCookie";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<MainLayout />}>
        {CoopRoutes()}
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Route>
  )
);

function App() {
  const { getAccessToken, setAccessToken } = useCookie();

  useEffect(() => {
    setupInterceptors({ getAccessToken, setAccessToken });
  }, [getAccessToken, setAccessToken]);

  return <RouterProvider router={router} />;
}

export default App;

