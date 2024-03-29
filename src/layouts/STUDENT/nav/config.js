// component
import PaymentIcon from '@mui/icons-material/Payment';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/siswa/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'tagihan',
    path: '/siswa/tagihan',
    icon: <PaymentIcon />,
  },
];

export default navConfig;
