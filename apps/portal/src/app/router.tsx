import { createBrowserRouter } from "react-router";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { DashboardPage } from "./pages/DashboardPage";
import { HoldingsPage } from "./pages/HoldingsPage";
import { LoginPage } from "./pages/LoginPage";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      element: <AuthGuard />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "holdings", element: <HoldingsPage /> },
      ],
    },
    { path: "login", element: <LoginPage /> },
  ],
  { basename: import.meta.env.BASE_URL },
);
