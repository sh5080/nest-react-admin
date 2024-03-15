import * as React from 'react';

import '../global.css';

import { LocalizationProvider } from '../components/core/localization-provider';
import { ThemeProvider } from '../components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 };

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div>
      <LocalizationProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LocalizationProvider>
    </div>
  );
}
