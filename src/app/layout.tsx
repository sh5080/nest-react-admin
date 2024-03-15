import * as React from 'react';

import { LocalizationProvider } from '../components/core/localization-provider';
import { ThemeProvider } from '../components/core/theme-provider/theme-provider';

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
