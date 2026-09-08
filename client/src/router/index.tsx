import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AppLayout from '../layouts/AppLayout';
import AdminLayout from '../layouts/AdminLayout';
import CategoriesLayout from '../layouts/CategoriesLayout';
import CategoryLayout from '../layouts/CategoryLayout';
import HistoryLayout from '../layouts/HistoryLayout';
import AdminCategoriesLayout from '../layouts/AdminCategoriesLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import DashboardPage from '../pages/DashboardPage';
import HistoryPage from '../pages/HistoryPage';
import PromptDetailsPage from '../pages/history/PromptDetailsPage';
import ProfilePage from '../pages/ProfilePage';
import AdminHomePage from '../pages/admin/AdminHomePage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminCategoryNewPage from '../pages/admin/AdminCategoryNewPage';
import AdminCategoryEditPage from '../pages/admin/AdminCategoryEditPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import CategoryOverviewPage from '../pages/categories/CategoryOverviewPage';
import CategorySubcategoriesPage from '../pages/categories/CategorySubcategoriesPage';
import CategoryAskPage from '../pages/categories/CategoryAskPage';
import CategoryHistoryPage from '../pages/categories/CategoryHistoryPage';

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
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
              { index: true, element: <CategoriesPage /> },
              {
                path: ':categoryId',
                element: <CategoryLayout />,
                children: [
                  { index: true, element: <CategoryOverviewPage /> },
                  { path: 'subcategories', element: <CategorySubcategoriesPage /> },
                  { path: 'ask', element: <CategoryAskPage /> },
                  { path: 'history', element: <CategoryHistoryPage /> },
                ],
              },
            ],
          },
          { path: 'ask', element: <Navigate to="/categories" replace /> },
          {
            path: 'history',
            element: <HistoryLayout />,
            children: [
              { index: true, element: <HistoryPage /> },
              { path: ':promptId', element: <PromptDetailsPage /> },
            ],
          },
          { path: 'profile', element: <ProfilePage /> },
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
          { index: true, element: <AdminHomePage /> },
          { path: 'users', element: <AdminUsersPage /> },
          {
            path: 'categories',
            element: <AdminCategoriesLayout />,
            children: [
              { index: true, element: <AdminCategoriesPage /> },
              { path: 'new', element: <AdminCategoryNewPage /> },
              { path: ':categoryId/edit', element: <AdminCategoryEditPage /> },
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
