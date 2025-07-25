'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';
import { ReactNode } from 'react';

export const ThemeRegistry = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
