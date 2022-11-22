import React, { useEffect } from 'react';
import { EthProvider } from "./contexts/EthContext";
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppLoadEth } from './App';
import { CssBaseline } from '@mui/material';
import { DarkModeContext } from './DarkModeContext';

type COLORMODE_TYPE = 'light' | 'dark';

function AppRoot() {
  const [mode, setMode] = React.useState<COLORMODE_TYPE>(window.localStorage.getItem('colorMode') as COLORMODE_TYPE || "dark");
  const colorMode = React.useMemo(
    () => ({
      toggle: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  useEffect(() => {
    window.localStorage.setItem('colorMode', mode);
  }, [mode])

  return (
    <DarkModeContext.Provider value={{...colorMode, isDarkMode: mode === "dark"}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <AppLoadEth />
        </SnackbarProvider>
      </ThemeProvider>
    </DarkModeContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <EthProvider autoInit={false}>
      <AppRoot />
    </EthProvider>
);
