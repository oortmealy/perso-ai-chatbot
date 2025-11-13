import { createTheme } from '@mui/material/styles';

// Custom color palette
const deepNavy = 'rgb(31, 27, 56)';
const blueViolet = 'rgb(130, 102, 225)';
const purpleGradient = 'rgb(100, 74, 134)';
const pinkPurple = 'rgb(184, 127, 174)';

const theme = createTheme({
  palette: {
    primary: {
      main: blueViolet, // 선명한 블루-바이올렛
      light: pinkPurple, // 핑크-퍼플 하이라이트
      dark: purpleGradient, // 보라빛 그라데이션 중간톤
      contrastText: '#ffffff',
    },
    secondary: {
      main: pinkPurple, // 핑크-퍼플 하이라이트
      light: 'rgb(200, 160, 200)',
      dark: purpleGradient,
    },
    background: {
      default: '#f5f5f5', // 밝은 회색 배경
      paper: '#ffffff', // 흰색 페이퍼
    },
    text: {
      primary: deepNavy, // 진한 남보라를 텍스트 색상으로
      secondary: purpleGradient, // 보라빛 그라데이션을 보조 텍스트로
    },
    divider: 'rgba(130, 102, 225, 0.2)',
    action: {
      selected: 'rgba(130, 102, 225, 0.1)',
      hover: 'rgba(184, 127, 174, 0.08)',
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
            backgroundColor: 'rgba(100, 74, 134, 0.2)',
            '& fieldset': {
              borderColor: 'rgba(130, 102, 225, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(130, 102, 225, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: blueViolet,
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
            borderLeft: `4px solid ${blueViolet}`,
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