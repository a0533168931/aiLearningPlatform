import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    error: {
      main: '#be123c',
    },
    success: {
      main: '#065f46',
    },
    text: {
      primary: '#1e1b4b',
      secondary: '#6d4bb0',
    },
  },
  typography: {
    fontFamily: 'system-ui, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
          textTransform: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 12,
          fontSize: 15,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c4b5fd',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a78bfa',
            borderWidth: 1.5,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fb7185',
          },
        },
        notchedOutline: {
          borderColor: '#ddd6fe',
          borderWidth: 1.5,
        },
        input: {
          padding: '12px 16px',
          color: '#1e1b4b',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
        },
        colorError: {
          backgroundColor: '#fff1f2',
          color: '#be123c',
          border: '1px solid #fecdd3',
        },
        colorSuccess: {
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0',
        },
      },
    },
  },
});

export default theme;
