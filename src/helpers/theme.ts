import { createTheme } from '@mui/material/styles';

// Default theme
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#d2439d',
    },
    secondary: {
      main: '#787878',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#787878',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
        },
      },
    },
  },
});

// Fun theme (Studio Ghibli-inspired)
export const funTheme = createTheme({
  palette: {
    primary: {
      main: '#32527B', // Howl's Blue
      light: '#4A77A9',
      dark: '#274060',
    },
    secondary: {
      main: '#A6D784', // Spirited Meadow
      light: '#BFEA9F',
      dark: '#8ABF69',
    },
    background: {
      default: '#FFFAF0', // Floral White
      paper: '#F5F5DC', // Beige
    },
    text: {
      primary: '#403D26', // Deep Brown
      secondary: '#6C7A8E', // Totoro Gray
    },
    error: {
      main: '#FF5C5C', // Kiki's Delivery Red
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#403D26',
    },
    h2: {
      color: '#32527B',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          background: '#F5F5DC',
          '&:hover': {
            background: '#FFFAF0',
          },
          borderColor: '#32527B',
          color: '#32527B',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F5DC',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.active .MuiSvgIcon-root': {
            color: '#32527B',
          },
        },
      },
    },
  },
});

// Clean theme (Modern Professional)
export const cleanTheme = createTheme({
  palette: {
    primary: {
      main: '#2E3A59', // Deep Slate Blue
      light: '#3D4D77',
      dark: '#1F2A47',
    },
    secondary: {
      main: '#A0AEC0', // Cool Gray
      light: '#CBD5E0',
      dark: '#718096',
    },
    background: {
      default: '#FFFFFF', // White
      paper: '#F7FAFC', // Light Gray
    },
    text: {
      primary: '#1A202C', // Dark Gray
      secondary: '#718096', // Medium Gray
    },
    info: {
      main: '#3182CE', // Blue accent
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1A202C',
    },
    h2: {
      fontWeight: 600,
      color: '#2E3A59',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          borderColor: '#2E3A59',
          color: '#2E3A59',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#F7FAFC',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.active .MuiSvgIcon-root': {
            color: '#3182CE',
          },
        },
      },
    },
  },
});

// Get current theme based on theme type
export const getThemeByType = (themeType: string) => {
  switch (themeType) {
    case 'fun':
      return funTheme;
    case 'clean':
      return cleanTheme;
    default:
      return defaultTheme;
  }
};
