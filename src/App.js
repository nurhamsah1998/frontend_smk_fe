import React from 'react';

// routes
// eslint-disable-next-line import/no-unresolved
import { ErrorBoundary } from 'react-error-boundary';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { Dialog } from './hooks/useContextHook';
import ScreenDialog from './components/ScreenDialog';
import ErrorPage from './pages/ErrorPage';

// ----------------------------------------------------------------------

export default function App() {
  const [dialog, setDialog] = React.useState({
    do: null,
    title: 'text here',
    content: null,
    helperText: null,
    variant: '',
    labelClose: '',
    labelSubmit: '',
    isCloseAfterSubmit: false,
    fullWidth: true,
    isLoadingAfterSubmit: false,
    isLoading: false,
  });

  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <ThemeProvider>
        <Dialog.Provider value={{ setDialog }}>
          <ScrollToTop />
          <StyledChart />
          <Router />
          {Boolean(dialog.do) && (
            <ScreenDialog
              fullWidth={dialog.fullWidth}
              title={dialog.title}
              variant={dialog.variant}
              labelClose={dialog.labelClose}
              isLoading={dialog.isLoading}
              labelSubmit={dialog.labelSubmit}
              helperText={dialog.helperText}
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
          )}
        </Dialog.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
