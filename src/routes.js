import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import SimpleLayout from './layouts/simple';
//
import LoginStudentPage from './pages/AuthPage/siswa/Login/LoginStudentPage';
import Page404 from './pages/Page404';
import LoginStaff from './pages/AuthPage/staff/Login/LoginStaff';
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
import ReportTransaksiMasuk from './pages/STAFF_TU/Laporan/transaksi_masuk/ReportTransaksi';
import ReportTransaksiKeluar from './pages/STAFF_TU/Laporan/transaksi_keluar/ReportTransaksi';
import DashboardLayoutDEV from './layouts/DEV/DashboardLayoutDEV';
import LogActivity from './pages/DEV/Log/LogActivity';
import DashboardDev from './pages/DEV/Dashboard/Dashboard';
import Brand from './pages/Anonim/Brand';
import Account from './pages/DEV/Account/Account';
import Campaign from './pages/STAFF_TU/Campaign/Campaign';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dev',
      element: <DashboardLayoutDEV />,
      children: [
        { element: <Navigate to="/dev/dashboard" />, index: true },
        { path: 'dashboard', element: <DashboardDev /> },
        { path: 'log-activity', element: <LogActivity /> },
        { path: 'account', element: <Account /> },
      ],
    },
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
        { path: 'laporan-transaksi-masuk', element: <ReportTransaksiMasuk /> },
        { path: 'laporan-transaksi-keluar', element: <ReportTransaksiKeluar /> },
        { path: 'pengumuman', element: <Campaign /> },
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
      path: 'brand',
      element: <Brand />,
    },
    // {
    //   path: 'siswa-register',
    //   element: <RegisterStudentPage />,
    // },
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
