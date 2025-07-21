import type { ExternalEntityData } from '../../../src';
import { EntityTypeEnum } from '../../../src';
import type { FixtureJavaVersion } from '../../test/FixtureJavaVersion';

// not a function to be more explicit with the values and in case the link formats change
const UrlMappings = {
  7: '',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  13: '',
  14: '',
  15: '',
  16: 'https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/io/Serializable.html',
  17: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/Serializable.html',
  18: 'https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/io/Serializable.html',
  19: 'https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/Serializable.html',
  20: 'https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/io/Serializable.html',
  21: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/Serializable.html',
} satisfies Record<FixtureJavaVersion, string>;

const SerializableNames = {
  7: 'java.io.Serializable',
  8: 'java.io.Serializable',
  9: 'java.io.Serializable',
  10: 'java.io.Serializable',
  11: 'java.io.Serializable',
  12: 'java.io.Serializable',
  13: 'java.io.Serializable',
  14: 'java.io.Serializable',
  15: 'java.io.Serializable',
  16: 'Serializable',
  17: 'Serializable',
  18: 'Serializable',
  19: 'Serializable',
  20: 'Serializable',
  21: 'Serializable',
} as const satisfies Record<FixtureJavaVersion, string>;

export function generateSerializableInterface(
  version: FixtureJavaVersion,
): ExternalEntityData {
  return {
    entityType: EntityTypeEnum.ExternalObject,
    id: 'java.io.Serializable',
    name: SerializableNames[version],
    qualifiedName: 'java.io.Serializable',
    description: null,
    url: UrlMappings[version],
    signature: SerializableNames[version],
  };
}
