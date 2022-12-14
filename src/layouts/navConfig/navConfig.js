// component
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
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
    title: 'Pembayaran',
    path: '/staff-tu/pembayaran',
    icon: <PointOfSaleIcon />,
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
