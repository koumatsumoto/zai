import { createBrowserRouter } from "react-router";
import { Layout } from "@/shared/components/layout/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { HoldingsPage } from "./pages/HoldingsPage";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "holdings", element: <HoldingsPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
