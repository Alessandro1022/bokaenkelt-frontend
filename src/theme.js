import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37',
      light: '#E5C76B',
      dark: '#B38B2D',
    },
    secondary: {
      main: '#B38B2D',
      light: '#C4A35F',
      dark: '#8F6F24',
    },
    background: {
      default: '#FDF6E3',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#D4AF37',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#D4AF37',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#D4AF37',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#D4AF37',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 8px rgba(212, 175, 55, 0.15)',
        },
      },
    },
  },
});

export default theme; 