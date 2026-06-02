import { createBrowserRouter } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import AdminPage from "./pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/history",
    element: <HistoryPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
]);

export default router;