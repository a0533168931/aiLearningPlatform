import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './styles/mui.css';
import { queryClient } from './lib/queryClient';
import router from './router';
import theme from './theme';

createRoot(document.getElementById('root')!).render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StyledEngineProvider>,
);
