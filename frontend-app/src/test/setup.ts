import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';
import { setAuthToken } from '@/lib/api-client';

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { accessToken: 'test-token' }, status: 'authenticated' }),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: unknown }) => children,
}));

beforeEach(() => {
  setAuthToken('test-token');
});

// Add any global mocks here if needed (e.g. ResizeObserver, IntersectionObserver)
// global.ResizeObserver = vi.fn().mockImplementation(() => ({
//   observe: vi.fn(),
//   unobserve: vi.fn(),
//   disconnect: vi.fn(),
// }));
