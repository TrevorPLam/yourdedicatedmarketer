import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// MSW worker for browser environments (Vitest browser mode, Playwright)
export const worker = setupWorker(...handlers);
