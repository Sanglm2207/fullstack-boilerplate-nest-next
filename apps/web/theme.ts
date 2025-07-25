// src/theme.ts
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Màu xanh MUI default
    },
    secondary: {
      main: '#9c27b0', // Tím
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
