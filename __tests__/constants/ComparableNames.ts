import type { FixtureJavaVersion } from '../test/FixtureJavaVersion';

export const ComparableNames = {
  8: 'java.lang.Comparable',
  9: 'java.lang.Comparable',
  10: 'java.lang.Comparable',
  11: 'java.lang.Comparable',
  12: 'java.lang.Comparable',
  13: 'java.lang.Comparable',
  14: 'java.lang.Comparable',
  15: 'java.lang.Comparable',
  16: 'Comparable',
  17: 'Comparable',
  18: 'Comparable',
  19: 'Comparable',
  20: 'Comparable',
  21: 'Comparable',
} as const satisfies Record<FixtureJavaVersion, string>;
