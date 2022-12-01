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
  });
  return (
    <ThemeProvider>
      <Dialog.Provider value={{ setDialog }}>
        <ScrollToTop />
        <StyledChart />
        <Router />
        <ScreenDialog
          fullWidth={false}
          title={dialog.title}
          labelClose={dialog.labelClose}
          labelSubmit={dialog.labelSubmit}
          open={Boolean(dialog.do)}
          handleSubmit={() => {
            dialog.do();
            setDialog((i) => ({ ...i, do: null }));
          }}
          handleClose={() => setDialog((i) => ({ ...i, do: null }))}
        >
          {dialog.content}
        </ScreenDialog>
      </Dialog.Provider>
    </ThemeProvider>
  );
}
