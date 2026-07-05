import { render, type RenderResult } from '@testing-library/react';
import { ThemeProvider } from '@repo/ui';

export function renderWithProviders(ui: React.ReactElement): RenderResult {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}
