// component
import PaymentIcon from '@mui/icons-material/Payment';
import NewspaperIcon from '@mui/icons-material/Newspaper';
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
    title: 'Kabar Berita',
    path: '/siswa/news',
    icon: <NewspaperIcon />,
  },
  {
    title: 'tagihan',
    path: '/siswa/tagihan',
    icon: <PaymentIcon />,
  },
];

export default navConfig;
