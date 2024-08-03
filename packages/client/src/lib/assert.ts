class AssertionError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'AssertionError';
  }
}

export function assert(
  condition: unknown,
  error: Error | string = new AssertionError('조건이 충족되지 않았습니다.'),
): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new AssertionError(error);
    } else {
      throw error;
    }
  }
}
