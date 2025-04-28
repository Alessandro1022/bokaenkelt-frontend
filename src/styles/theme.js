import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37', // Rich gold
      light: '#E5C76B',
      dark: '#B38B2D',
      contrastText: '#000000'
    },
    secondary: {
      main: '#F5F5F5', // Pearl white
      light: '#FFFFFF',
      dark: '#E0E0E0',
      contrastText: '#000000'
    },
    background: {
      default: '#FFFFFF',
      paper: '#FDF6E3' // Warm pearl
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.02em'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.02em'
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          border: '2px solid',
          '&:hover': {
            borderWidth: '2px'
          }
        },
        contained: {
          background: 'linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)',
          boxShadow: '0 3px 5px 2px rgba(212, 175, 55, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #D4AF37',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)',
          boxShadow: '0 3px 5px 2px rgba(212, 175, 55, .3)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)',
          borderRight: '2px solid #D4AF37'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#D4AF37'
            },
            '&:hover fieldset': {
              borderColor: '#B38B2D'
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D4AF37'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B38B2D'
          }
        }
      }
    }
  }
});

export default theme; 