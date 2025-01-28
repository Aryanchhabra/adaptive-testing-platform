import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2dd4bf',
      light: '#4aedc4',
      dark: '#1f9d8b',
    },
    secondary: {
      main: '#38bdf8',
      light: '#5ccbff',
      dark: '#2894c7',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
  },
}); 