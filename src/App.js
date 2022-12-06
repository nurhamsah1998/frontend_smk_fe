import React from 'react';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { Dialog } from './hooks/useContextHook';
import ScreenDialog from './components/ScreenDialog';

// ----------------------------------------------------------------------

export default function App() {
  const [dialog, setDialog] = React.useState({
    do: null,
    title: 'text here',
    content: null,
    labelClose: '',
    labelSubmit: '',
    isCloseAfterSubmit: false,
    isLoadingAfterSubmit: false,
    isLoading: false,
  });

  return (
    <ThemeProvider>
      <Dialog.Provider value={{ setDialog }}>
        <ScrollToTop />
        <StyledChart />
        <Router />
        <ScreenDialog
          fullWidth
          title={dialog.title}
          labelClose={dialog.labelClose}
          isLoading={dialog.isLoading}
          labelSubmit={dialog.labelSubmit}
          open={Boolean(dialog.do)}
          handleSubmit={() => {
            dialog.do();
            if (dialog.isCloseAfterSubmit) {
              setDialog((i) => ({ ...i, do: null }));
            }
            if (dialog.isLoadingAfterSubmit) {
              setDialog((i) => ({ ...i, isLoading: true }));
            }
          }}
          handleClose={() => setDialog((i) => ({ ...i, do: null }))}
        >
          {dialog.content}
        </ScreenDialog>
      </Dialog.Provider>
    </ThemeProvider>
  );
}
