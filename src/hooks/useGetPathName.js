import React from 'react';
import { useLocation } from 'react-router-dom';

function useGetPathName({ navConfigMenu = [] }) {
  const location = useLocation();
  const currentPage = React.useMemo(() => {
    const isUpdateNewsPage = location?.pathname?.includes('/dev/news/update-news/');
    const isDetailNewsPage = location?.pathname?.includes('/news/detail/');
    try {
      const isMatch = navConfigMenu.find((item) => item.path === location.pathname);
      return isMatch.title;
    } catch (error) {
      return isUpdateNewsPage ? 'Edit Kabar Berita' : isDetailNewsPage ? 'Konten Berita' : 'Detail Pembayaran';
    }
  }, [location?.pathname]);
  return currentPage;
}

export default useGetPathName;
