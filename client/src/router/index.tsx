import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AppLayout from '../layouts/AppLayout';
import AdminLayout from '../layouts/AdminLayout';
import CategoriesLayout from '../layouts/CategoriesLayout';
import CategoryLayout from '../layouts/CategoryLayout';
import HistoryLayout from '../layouts/HistoryLayout';
import AdminCategoriesLayout from '../layouts/AdminCategoriesLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import PlaceholderPage from '../pages/PlaceholderPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import HistoryPage from '../pages/HistoryPage';
import AdminPage from '../pages/AdminPage';

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <RegisterPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          {
            path: 'categories',
            element: <CategoriesLayout />,
            children: [
              { index: true, element: <PlaceholderPage /> },
              {
                path: ':categoryId',
                element: <CategoryLayout />,
                children: [
                  { index: true, element: <PlaceholderPage /> },
                  { path: 'subcategories', element: <PlaceholderPage /> },
                  { path: 'ask', element: <PlaceholderPage /> },
                  { path: 'history', element: <PlaceholderPage /> },
                ],
              },
            ],
          },
          { path: 'ask', element: <PlaceholderPage /> },
          {
            path: 'history',
            element: <HistoryLayout />,
            children: [
              { index: true, element: <HistoryPage /> },
              { path: ':promptId', element: <PlaceholderPage /> },
            ],
          },
          { path: 'profile', element: <PlaceholderPage /> },
        ],
      },
    ],
  },
  {
    path: 'admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminPage /> },
          { path: 'users', element: <PlaceholderPage /> },
          {
            path: 'categories',
            element: <AdminCategoriesLayout />,
            children: [
              { index: true, element: <PlaceholderPage /> },
              { path: 'new', element: <PlaceholderPage /> },
              { path: ':categoryId/edit', element: <PlaceholderPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: 'unauthorized', element: <UnauthorizedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
