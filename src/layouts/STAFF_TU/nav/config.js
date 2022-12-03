// component
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
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

export default navConfig;
