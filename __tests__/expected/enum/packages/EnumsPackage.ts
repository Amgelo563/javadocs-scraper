import { Collection } from '@discordjs/collection';
import type { PackageData } from '../../../../src';
import { EntityTypeEnum } from '../../../../src';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import {
  generatePackageName,
  generatePackageUrl,
} from '../../package/PackageValuesFactory';
import { generateTestEnum } from '../enums/TestEnum';

const EnumsSubPackageName = 'enums' as const;
const EnumsPackageName = generatePackageName(EnumsSubPackageName);

function generateEmptyEnumsPackage(baseUrl: string): PackageData {
  return {
    entityType: EntityTypeEnum.Package,
    id: EnumsPackageName,
    name: EnumsPackageName,
    subpackageName: EnumsSubPackageName,
    signature: `Package ${EnumsPackageName}`,
    description: null,
    url: generatePackageUrl(baseUrl, EnumsSubPackageName),
    relatedPackages: new Collection(),
    classes: new Collection(),
    enums: new Collection(),
    interfaces: new Collection(),
    annotations: new Collection(),
  };
}

export function generateEnumsPackage(
  baseUrl: string,
  version: FixtureJavaVersion,
): PackageData {
  const enumsPackage = generateEmptyEnumsPackage(baseUrl);

  const testEnum = generateTestEnum(enumsPackage, version);
  enumsPackage.enums.set(testEnum.id, testEnum);

  return enumsPackage;
}
