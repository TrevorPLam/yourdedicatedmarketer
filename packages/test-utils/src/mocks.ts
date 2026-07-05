import { vi } from 'vitest';

export function mockNextNavigation() {
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
    redirect: vi.fn(),
    notFound: vi.fn(),
  }));
}

export function mockResend() {
  vi.mock('resend', () => ({
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
      },
    })),
  }));
}

export function mockUseActionState() {
  vi.mock('react-dom', () => ({
    ...vi.importActual('react-dom'),
    useActionState: vi.fn(() => [{}, vi.fn(), false]),
  }));
}
