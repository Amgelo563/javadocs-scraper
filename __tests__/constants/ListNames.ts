import type { FixtureJavaVersion } from '../test/FixtureJavaVersion';

export const ListNames = {
  8: 'java.util.List',
  9: 'java.util.List',
  10: 'java.util.List',
  11: 'java.util.List',
  12: 'java.util.List',
  13: 'java.util.List',
  14: 'java.util.List',
  15: 'java.util.List',
  16: 'List',
  17: 'List',
  18: 'List',
  19: 'List',
  20: 'List',
  21: 'List',
} as const satisfies Record<FixtureJavaVersion, string>;
