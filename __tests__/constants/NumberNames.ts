import type { FixtureJavaVersion } from '../test/FixtureJavaVersion';

export const NumberNames = {
  8: 'java.lang.Number',
  9: 'java.lang.Number',
  10: 'java.lang.Number',
  11: 'java.lang.Number',
  12: 'java.lang.Number',
  13: 'java.lang.Number',
  14: 'java.lang.Number',
  15: 'java.lang.Number',
  16: 'Number',
  17: 'Number',
  18: 'Number',
  19: 'Number',
  20: 'Number',
  21: 'Number',
} as const satisfies Record<FixtureJavaVersion, string>;
