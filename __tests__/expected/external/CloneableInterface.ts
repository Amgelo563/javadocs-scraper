import type { ExternalEntityData } from '../../../src';
import { EntityTypeEnum } from '../../../src';
import type { FixtureJavaVersion } from '../../test/FixtureJavaVersion';

// not a function to be more explicit with the values and in case the link formats change
const UrlMappings = {
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  13: '',
  14: '',
  15: '',
  16: 'https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Cloneable.html',
  17: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Cloneable.html',
  18: 'https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/lang/Cloneable.html',
  19: 'https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Cloneable.html',
  20: 'https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Cloneable.html',
  21: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Cloneable.html',
} satisfies Record<FixtureJavaVersion, string>;

const CloneableNames = {
  8: 'java.lang.Cloneable',
  9: 'java.lang.Cloneable',
  10: 'java.lang.Cloneable',
  11: 'java.lang.Cloneable',
  12: 'java.lang.Cloneable',
  13: 'java.lang.Cloneable',
  14: 'java.lang.Cloneable',
  15: 'java.lang.Cloneable',
  16: 'Cloneable',
  17: 'Cloneable',
  18: 'Cloneable',
  19: 'Cloneable',
  20: 'Cloneable',
  21: 'Cloneable',
} satisfies Record<FixtureJavaVersion, string>;

export function generateCloneableInterface(
  version: FixtureJavaVersion,
): ExternalEntityData {
  return {
    entityType: EntityTypeEnum.ExternalObject,
    id: 'java.lang.Cloneable',
    name: CloneableNames[version],
    qualifiedName: 'java.lang.Cloneable',
    description: null,
    url: UrlMappings[version],
    signature: CloneableNames[version],
  };
}
