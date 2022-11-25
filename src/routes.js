import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginStudentPage from './pages/AuthPage/Login/LoginStudentPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import LoginStaff from './pages/AuthPage/LoginStaff';
import RegisterStudentPage from './pages/AuthPage/Register/RegisterStudentPage';
import AppSiswa from './pages/SISWA/AppSiswa';
import DashboardLayoutStudent from './layouts/STUDENT/DashboardLayoutStudent';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/siswa',
      element: <DashboardLayoutStudent />,
      children: [
        { element: <Navigate to="/siswa/app" />, index: true },
        { path: 'app', element: <AppSiswa /> },
      ],
    },
    {
      path: 'siswa-login',
      element: <LoginStudentPage />,
    },
    {
      path: 'siswa-register',
      element: <RegisterStudentPage />,
    },
    {
      path: 'staff-login',
      element: <LoginStaff />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
