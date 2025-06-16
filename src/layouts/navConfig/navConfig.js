// component
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import LogoutIcon from '@mui/icons-material/Logout';
import Groups2Icon from '@mui/icons-material/Groups2';
import PaymentIcon from '@mui/icons-material/Payment';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CampaignIcon from '@mui/icons-material/Campaign';
import FastForwardIcon from '@mui/icons-material/FastForward';
import SettingsIcon from '@mui/icons-material/Settings';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import StorageIcon from '@mui/icons-material/Storage';
import SchoolIcon from '@mui/icons-material/School';

import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

export const navConfigTU = [
  {
    title: 'Dashboard',
    path: '/staff-tu/dashboard',
    icon: icon('ic_analytics'),
    permission: true,
    name: 'dashboard',
  },
  {
    title: 'Tagihan',
    path: '/staff-tu/tagihan',
    icon: <RequestQuoteIcon />,
    permission: false,
    name: 'tagihan',
  },
  {
    title: 'Daftar Siswa',
    path: '/staff-tu/daftar-siswa',
    icon: <Groups2Icon />,
    permission: false,
    name: 'daftar_siswa',
  },
  {
    title: 'Pembayaran',
    path: '/staff-tu/pembayaran',
    icon: <PaymentIcon />,
    permission: false,
    name: 'pembayaran',
  },
  {
    title: 'Transaksi Masuk',
    path: '/staff-tu/laporan-transaksi-masuk',
    icon: <FastRewindIcon />,
    permission: false,
    name: 'laporan_transaksi_masuk',
  },
  {
    title: 'Transaksi Keluar',
    path: '/staff-tu/laporan-transaksi-keluar',
    icon: <FastForwardIcon />,
    permission: false,
    name: 'laporan_transaksi_keluar',
  },
  {
    title: 'Pengumuman',
    path: '/staff-tu/pengumuman',
    icon: <CampaignIcon />,
    permission: false,
    name: 'pengumuman',
  },
  {
    title: 'Pengaturan',
    path: '/staff-tu/pengaturan',
    icon: <SettingsIcon />,
    permission: true,
    name: 'log_out',
  },
  {
    title: 'Keluar',
    path: '/log-out',
    icon: <LogoutIcon />,
    permission: true,
    name: 'log_out',
  },
];
export const navConfigDEV = [
  {
    title: 'Dashboard',
    path: '/dev/dashboard',
    name: 'dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Log Activity',
    path: '/dev/log-activity',
    name: 'log_activity',
    icon: <ContentPasteIcon />,
  },
  {
    title: 'Akun Staff',
    path: '/dev/account',
    name: 'account_staff',
    icon: <AssignmentIndIcon />,
  },
  {
    title: 'Jurusan',
    path: '/dev/major',
    name: 'major',
    icon: <SchoolIcon />,
  },
  {
    title: 'Files',
    path: '/dev/files',
    name: 'files',
    icon: <InsertDriveFileIcon />,
  },
  {
    title: 'Server',
    path: '/dev/server',
    name: 'server',
    icon: <StorageIcon />,
  },
];
export const navConfigPPDB = [
  {
    title: 'Dashboard',
    path: '/staff-ppdb/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Pendaftar',
    path: '/staff-ppdb/pendaftar',
    icon: <RequestQuoteIcon />,
  },
];
