import { Navigate, useRoutes } from 'react-router-dom';
import { lazy } from 'react';
// layouts
//
import SimpleLayout from './layouts/simple';
import DashboardLayoutDEV from './layouts/DEV/DashboardLayoutDEV';
import DashboardLayoutStaff from './layouts/STAFF_TU/DashboardLayoutStaffTU';
import DashboardLayoutStudent from './layouts/STUDENT/DashboardLayoutStudent';
import LoginStudentPage from './pages/AuthPage/siswa/Login/LoginStudentPage';
import Page404 from './pages/Page404';
import LoginStaff from './pages/AuthPage/staff/Login/LoginStaff';
import Brand from './pages/Anonim/Brand';
import RegisterStaffPage from './pages/AuthPage/staff/Register/RegisterStaffPage';
import RouterPath from './RouterPath';
///
const AppSiswa = lazy(() => import('./pages/SISWA/AppSiswa'));
const AppStaffTU = lazy(() => import('./pages/STAFF_TU/AppStaffTU'));
const TagihanSiswa = lazy(() => import('./pages/SISWA/Tagihan/Tagihan'));
const TagihanStaff = lazy(() => import('./pages/STAFF_TU/Tagihan/TagihanStaff'));
const Pembayaran = lazy(() => import('./pages/STAFF_TU/Pembayaran/Pembayaran'));
const DaftarSiswa = lazy(() => import('./pages/STAFF_PPDB/DaftarSIswa/DaftarSiswa'));
const DetailTagihan = lazy(() => import('./pages/STAFF_TU/Pembayaran/Pembayaran/DetailTagihan'));
const ReportTransaksiMasuk = lazy(() => import('./pages/STAFF_TU/Laporan/transaksi_masuk/ReportTransaksi'));
const ReportTransaksiKeluar = lazy(() => import('./pages/STAFF_TU/Laporan/transaksi_keluar/ReportTransaksi'));
const NewsTu = lazy(() => import('./pages/STAFF_TU/news/News'));
const NewsStudent = lazy(() => import('./pages/SISWA/news/News'));
const LogActivity = lazy(() => import('./pages/DEV/Log/LogActivity'));
const DashboardDev = lazy(() => import('./pages/DEV/Dashboard/Dashboard'));
const Account = lazy(() => import('./pages/DEV/Account/Account'));
const Major = lazy(() => import('./pages/DEV/major/Major'));
const Files = lazy(() => import('./pages/DEV/files/Files'));
const Server = lazy(() => import('./pages/DEV/server/Server'));
const News = lazy(() => import('./pages/DEV/news/News'));
const MyNews = lazy(() => import('./pages/DEV/news/MyNews'));
const PublicNewsDetail = lazy(() => import('./pages/PublicNewsDetail'));
const PrivateNewsDetail = lazy(() => import('./pages/DEV/news/PrivateNewsDetail'));
const AllNews = lazy(() => import('./pages/DEV/news/AllNews'));
const NewsMutation = lazy(() => import('./pages/DEV/news/NewsMutation'));
const Campaign = lazy(() => import('./pages/STAFF_TU/Campaign/Campaign'));
const Pengaturan = lazy(() => import('./pages/STAFF_TU/Pengaturan/Pengaturan'));

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
        { path: 'major', element: <Major /> },
        { path: 'files', element: <Files /> },
        { path: 'server', element: <Server /> },
        {
          path: 'news',
          element: <News />,
          children: [
            { element: <AllNews />, index: true },
            { path: 'my-news', element: <MyNews /> },
            { path: 'detail/:id', element: <PrivateNewsDetail /> },
            { path: 'create-news', element: <NewsMutation /> },
            { path: 'update-news/:id', element: <NewsMutation /> },
          ],
        },
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
        { path: 'pengaturan', element: <Pengaturan /> },
        { path: 'news', element: <NewsTu /> },
        { path: 'news/detail/:id', element: <PrivateNewsDetail /> },
      ],
    },
    {
      path: '/siswa',
      element: <DashboardLayoutStudent />,
      children: [
        { element: <Navigate to="/siswa/app" />, index: true },
        { path: 'app', element: <AppSiswa /> },
        { path: 'tagihan', element: <TagihanSiswa /> },
        { path: 'news', element: <NewsStudent /> },
        { path: 'news/detail/:id', element: <PrivateNewsDetail /> },
      ],
    },

    {
      path: 'siswa-login',
      element: <LoginStudentPage />,
    },
    {
      path: 'news/:id',
      element: <PublicNewsDetail />,
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
