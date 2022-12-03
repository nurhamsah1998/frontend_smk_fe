import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginStudentPage from './pages/AuthPage/siswa/Login/LoginStudentPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import LoginStaff from './pages/AuthPage/staff/Login/LoginStaff';
import RegisterStudentPage from './pages/AuthPage/siswa/Register/RegisterStudentPage';
import AppSiswa from './pages/SISWA/AppSiswa';
import DashboardLayoutStudent from './layouts/STUDENT/DashboardLayoutStudent';
import RegisterStaffPage from './pages/AuthPage/staff/Register/RegisterStaffPage';
import DashboardLayoutStaff from './layouts/STAFF_TU/DashboardLayoutStaff';
import AppStaffTU from './pages/STAFF_TU/AppStaffTU';
import RouterPath from './RouterPath';
import TagihanSiswa from './pages/SISWA/Tagihan/Tagihan';
import TagihanStaff from './pages/STAFF_TU/Tagihan/TagihanStaff';
import Pembayaran from './pages/STAFF_TU/Pembayaran/Pembayaran';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/staff-tu',
      element: <DashboardLayoutStaff />,
      children: [
        { element: <Navigate to="/staff-tu/dashboard" />, index: true },
        { path: 'dashboard', element: <AppStaffTU /> },
        { path: 'tagihan', element: <TagihanStaff /> },
        { path: 'pembayaran', element: <Pembayaran /> },
        // { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/siswa',
      element: <DashboardLayoutStudent />,
      children: [
        { element: <Navigate to="/siswa/app" />, index: true },
        { path: 'app', element: <AppSiswa /> },
        { path: 'tagihan', element: <TagihanSiswa /> },
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
      path: 'staff-register',
      element: <RegisterStaffPage />,
    },
    {
      path: 'staff-login',
      element: <LoginStaff />,
    },
    {
      path: 'loading',
      element: <RouterPath />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="loading" />, index: true },
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
