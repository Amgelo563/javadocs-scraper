import type { ExternalEntityData } from '../../../src';
import { EntityTypeEnum } from '../../../src';
import type { FixtureJavaVersion } from '../../test/FixtureJavaVersion';

export function generateObjectClass(
  version: FixtureJavaVersion,
): ExternalEntityData {
  return {
    entityType: EntityTypeEnum.ExternalObject,
    id: 'java.lang.Object',
    name: 'Object',
    qualifiedName: 'java.lang.Object',
    description: null,
    url: `https://docs.oracle.com/en/java/javase/${version}/docs/api/java.base/java/lang/Object.html`,
    signature: 'Object',
  };
}
