import { createTheme } from '@mui/material/styles';

const linkedinColors = {
  primary: '#0A66C2',    // LinkedIn blue
  hover: '#084b8e',      // Darker blue for hover
  light: '#0b7ad4',      // Lighter blue for accents
  background: '#0f172a', // Dark background
  paper: '#1e293b',      // Paper background
  text: '#e2e8f0',      // Primary text
  textSecondary: '#94a3b8' // Secondary text
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: linkedinColors.primary,
      light: linkedinColors.light,
      dark: linkedinColors.hover,
    },
    background: {
      default: linkedinColors.background,
      paper: linkedinColors.paper,
    },
    text: {
      primary: linkedinColors.text,
      secondary: linkedinColors.textSecondary,
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
          backgroundColor: linkedinColors.paper,
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
        contained: {
          background: `linear-gradient(45deg, ${linkedinColors.primary}, ${linkedinColors.light})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${linkedinColors.hover}, ${linkedinColors.primary})`,
          }
        },
        outlined: {
          borderColor: linkedinColors.primary,
          color: linkedinColors.primary,
          '&:hover': {
            borderColor: linkedinColors.light,
            backgroundColor: `${linkedinColors.primary}10`,
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: linkedinColors.paper,
          backgroundImage: 'none',
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '& .gradient-text': {
            background: `linear-gradient(45deg, ${linkedinColors.primary}, ${linkedinColors.light})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }
        }
      }
    }
  },
});

export { linkedinColors }; 