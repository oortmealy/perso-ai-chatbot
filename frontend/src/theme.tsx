import { createTheme } from '@mui/material/styles';
import { grey, blueGrey, brown } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[600], // A neutral blue-grey for primary actions
      light: blueGrey[400],
      dark: blueGrey[800],
    },
    secondary: {
      main: brown[400], // A warm brown for secondary actions
      light: brown[200],
      dark: brown[600],
    },
    background: {
      default: grey[100], // Light grey for the overall background
      paper: '#ffffff', // White for paper components
    },
    text: {
      primary: grey[900],
      secondary: grey[600],
    },
    divider: grey[200],
    action: {
      selected: blueGrey[50],
      hover: grey[50],
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: ['"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'].join(','),
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '0.9375rem', // ~15px
    },
    body2: {
      fontSize: '0.875rem', // ~14px
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: 8,
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)', // Softer shadow
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: grey[50],
            '& fieldset': {
              borderColor: grey[200],
            },
            '&:hover fieldset': {
              borderColor: grey[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: blueGrey[500],
              borderWidth: '1px',
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px',
          '&.Mui-selected': {
            borderLeft: `4px solid ${blueGrey[500]}`,
            borderRadius: 0,
            marginLeft: 0,
            paddingLeft: 18,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          marginLeft: 8,
        },
      },
    },
  },
});

export default theme;