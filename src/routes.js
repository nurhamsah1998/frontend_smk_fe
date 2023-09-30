import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import SimpleLayout from './layouts/simple';
//
import LoginStudentPage from './pages/AuthPage/siswa/Login/LoginStudentPage';
import Page404 from './pages/Page404';
import LoginStaff from './pages/AuthPage/staff/Login/LoginStaff';
import RegisterStudentPage from './pages/AuthPage/siswa/Register/RegisterStudentPage';
import AppSiswa from './pages/SISWA/AppSiswa';
import DashboardLayoutStudent from './layouts/STUDENT/DashboardLayoutStudent';
import RegisterStaffPage from './pages/AuthPage/staff/Register/RegisterStaffPage';
import DashboardLayoutStaff from './layouts/STAFF_TU/DashboardLayoutStaffTU';
import AppStaffTU from './pages/STAFF_TU/AppStaffTU';
import RouterPath from './RouterPath';
import TagihanSiswa from './pages/SISWA/Tagihan/Tagihan';
import TagihanStaff from './pages/STAFF_TU/Tagihan/TagihanStaff';
import Pembayaran from './pages/STAFF_TU/Pembayaran/Pembayaran';
import DaftarSiswa from './pages/STAFF_PPDB/DaftarSIswa/DaftarSiswa';
import DetailTagihan from './pages/STAFF_TU/Pembayaran/Pembayaran/DetailTagihan';
import ReportTransaksi from './pages/Laporan/transaksi/ReportTransaksi';
import ReportTagihan from './pages/Laporan/tagihan/ReportTagihan';

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
        { path: 'daftar-siswa', element: <DaftarSiswa /> },
        {
          path: 'pembayaran',
          element: <Pembayaran />,
          children: [
            {
              path: 'detail-tagihan',
              element: <DetailTagihan />,
            },
          ],
        },
        { path: 'laporan-transaksi', element: <ReportTransaksi /> },
        { path: 'laporan-tagihan', element: <ReportTagihan /> },
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
