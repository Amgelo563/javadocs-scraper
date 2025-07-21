import path from 'path';

export const FixtureJavaVersions = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
] as const;

export type FixtureJavaVersion = (typeof FixtureJavaVersions)[number];

export function generatePath(
  version: FixtureJavaVersion,
  testsRoot: string,
): string {
  const file = version >= 11 ? 'index.html' : 'overview-summary.html';
  return path.join(testsRoot, 'fixtures', String(version), file);
}

export function supportsDeprecationForRemoval(
  version: FixtureJavaVersion,
): boolean {
  return version >= 9;
}

export function supportsExternalObjects(version: FixtureJavaVersion): boolean {
  return version >= 16;
}
