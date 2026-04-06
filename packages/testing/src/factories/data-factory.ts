// Data factory for testing
export function createDataFactory<T>(generator: () => T) {
  return {
    create: (overrides?: Partial<T>): T => {
      const base = generator();
      return { ...base, ...overrides };
    },
    createMany: (count: number, overrides?: Partial<T>): T[] => {
      return Array.from({ length: count }, () => {
        const base = generator();
        return { ...base, ...overrides };
      });
    },
  };
}
