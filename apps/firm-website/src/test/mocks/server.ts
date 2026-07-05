import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// MSW server for Node.js environments (Vitest jsdom mode)
export const server = setupServer(...handlers);
