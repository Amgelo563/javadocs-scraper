import type { FixtureJavaVersion } from '../test/FixtureJavaVersion';

export const EnumNames = {
  8: 'java.lang.Enum',
  9: 'java.lang.Enum',
  10: 'java.lang.Enum',
  11: 'java.lang.Enum',
  12: 'java.lang.Enum',
  13: 'java.lang.Enum',
  14: 'java.lang.Enum',
  15: 'java.lang.Enum',
  16: 'Enum',
  17: 'Enum',
  18: 'Enum',
  19: 'Enum',
  20: 'Enum',
  21: 'Enum',
} as const satisfies Record<FixtureJavaVersion, string>;
