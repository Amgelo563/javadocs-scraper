import type { FixtureJavaVersion } from '../test/FixtureJavaVersion';

export const ObjectNames = {
  7: 'java.lang.Object',
  8: 'java.lang.Object',
  9: 'java.lang.Object',
  10: 'java.lang.Object',
  11: 'java.lang.Object',
  12: 'java.lang.Object',
  13: 'java.lang.Object',
  14: 'java.lang.Object',
  15: 'java.lang.Object',
  16: 'Object',
  17: 'Object',
  18: 'Object',
  19: 'Object',
  20: 'Object',
  21: 'Object',
} as const satisfies Record<FixtureJavaVersion, string>;
