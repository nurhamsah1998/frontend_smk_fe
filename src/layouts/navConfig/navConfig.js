// component
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import LogoutIcon from '@mui/icons-material/Logout';
import Groups2Icon from '@mui/icons-material/Groups2';
import PaymentIcon from '@mui/icons-material/Payment';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

export const navConfigTU = [
  {
    title: 'Dashboard',
    path: '/staff-tu/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Tagihan',
    path: '/staff-tu/tagihan',
    icon: <RequestQuoteIcon />,
  },
  {
    title: 'Daftar Siswa',
    path: '/staff-tu/daftar-siswa',
    icon: <Groups2Icon />,
  },
  {
    title: 'Pembayaran',
    path: '/staff-tu/pembayaran',
    icon: <PaymentIcon />,
  },
  {
    title: 'Transaksi',
    path: '/staff-tu/laporan-transaksi',
    icon: <SwapHorizontalCircleIcon />,
  },
  {
    title: 'Keluar',
    path: '/log-out',
    icon: <LogoutIcon />,
  },
];
export const navConfigDEV = [
  {
    title: 'Dashboard',
    path: '/dev/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Log Activity',
    path: '/dev/log-activity',
    icon: <ContentPasteIcon />,
  },
  {
    title: 'Akun Staff',
    path: '/dev/account',
    icon: <AssignmentIndIcon />,
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
