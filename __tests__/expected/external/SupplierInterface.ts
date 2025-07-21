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
  16: 'https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/util/function/Supplier.html',
  17: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/function/Supplier.html',
  18: 'https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/util/function/Supplier.html',
  19: 'https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/util/function/Supplier.html',
  20: 'https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/util/function/Supplier.html',
  21: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/Supplier.html',
} satisfies Record<FixtureJavaVersion, string>;

const SupplierNames = {
  7: 'java.util.function.Supplier',
  8: 'java.util.function.Supplier',
  9: 'java.util.function.Supplier',
  10: 'java.util.function.Supplier',
  11: 'java.util.function.Supplier',
  12: 'java.util.function.Supplier',
  13: 'java.util.function.Supplier',
  14: 'java.util.function.Supplier',
  15: 'java.util.function.Supplier',
  16: 'Supplier',
  17: 'Supplier',
  18: 'Supplier',
  19: 'Supplier',
  20: 'Supplier',
  21: 'Supplier',
} as const satisfies Record<FixtureJavaVersion, string>;

export function generateSupplierInterface(
  version: FixtureJavaVersion,
): ExternalEntityData {
  return {
    entityType: EntityTypeEnum.ExternalObject,
    id: 'java.util.function.Supplier',
    name: SupplierNames[version],
    qualifiedName: 'java.util.function.Supplier',
    description: null,
    url: UrlMappings[version],
    signature: 'Supplier',
  };
}
