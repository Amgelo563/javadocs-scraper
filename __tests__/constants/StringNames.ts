import type { FixtureJavaVersion } from '../test/FixtureJavaVersion';

export const StringNames = {
  8: 'java.lang.String',
  9: 'java.lang.String',
  10: 'java.lang.String',
  11: 'java.lang.String',
  12: 'java.lang.String',
  13: 'java.lang.String',
  14: 'java.lang.String',
  15: 'java.lang.String',
  16: 'String',
  17: 'String',
  18: 'String',
  19: 'String',
  20: 'String',
  21: 'String',
} as const satisfies Record<FixtureJavaVersion, string>;
