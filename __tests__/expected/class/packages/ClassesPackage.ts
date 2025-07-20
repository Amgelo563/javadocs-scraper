import { Collection } from '@discordjs/collection';
import type { PackageData } from '../../../../src';
import { EntityTypeEnum } from '../../../../src';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import {
  generatePackageName,
  generatePackageUrl,
} from '../../package/PackageValuesFactory';
import { generateBaseClass } from '../classes/BaseClass';
import { generateTestClass } from '../classes/TestClass';

const ClassesSubPackageName = 'classes' as const;
const ClassesPackageName = generatePackageName(ClassesSubPackageName);

function generateEmptyClassesPackage(baseUrl: string): PackageData {
  return {
    entityType: EntityTypeEnum.Package,
    id: ClassesPackageName,
    name: ClassesPackageName,
    subpackageName: ClassesSubPackageName,
    signature: `Package ${ClassesPackageName}`,
    description: null,
    url: generatePackageUrl(baseUrl, ClassesSubPackageName),
    relatedPackages: new Collection(),
    classes: new Collection(),
    enums: new Collection(),
    interfaces: new Collection(),
    annotations: new Collection(),
  };
}

export function generateClassesPackage(
  baseUrl: string,
  version: FixtureJavaVersion,
): PackageData {
  const classesPackage = generateEmptyClassesPackage(baseUrl);

  const baseClass = generateBaseClass(classesPackage, version);
  classesPackage.classes.set(baseClass.id, baseClass);

  const testClass = generateTestClass({
    baseClass,
    version,
    classPackage: classesPackage,
  });
  classesPackage.classes.set(testClass.id, testClass);

  return classesPackage;
}
