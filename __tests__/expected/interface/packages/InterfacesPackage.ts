import { Collection } from '@discordjs/collection';
import type { PackageData } from '../../../../src';
import { EntityTypeEnum } from '../../../../src';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import {
  generatePackageName,
  generatePackageUrl,
} from '../../package/PackageValuesFactory';
import { generateBaseInterface } from '../interfaces/BaseInterface';
import { generateTestInterface } from '../interfaces/TestInterface';

const InterfacesSubPackageName = 'interfaces' as const;
const InterfacesPackageName = generatePackageName(InterfacesSubPackageName);

function generateEmptyInterfacesPackage(baseUrl: string): PackageData {
  return {
    entityType: EntityTypeEnum.Package,
    id: InterfacesPackageName,
    name: InterfacesPackageName,
    subpackageName: InterfacesSubPackageName,
    signature: `Package ${InterfacesPackageName}`,
    description: null,
    url: generatePackageUrl(baseUrl, InterfacesSubPackageName),
    relatedPackages: new Collection(),
    classes: new Collection(),
    enums: new Collection(),
    interfaces: new Collection(),
    annotations: new Collection(),
  };
}

export function generateInterfacesPackage(
  baseUrl: string,
  version: FixtureJavaVersion,
): PackageData {
  const interfacesPackage = generateEmptyInterfacesPackage(baseUrl);

  const baseInterface = generateBaseInterface(interfacesPackage, version);
  interfacesPackage.interfaces.set(baseInterface.id, baseInterface);

  const testInterface = generateTestInterface({
    interfacePackage: interfacesPackage,
    baseInterface,
    version,
  });
  interfacesPackage.interfaces.set(testInterface.id, testInterface);

  return interfacesPackage;
}
