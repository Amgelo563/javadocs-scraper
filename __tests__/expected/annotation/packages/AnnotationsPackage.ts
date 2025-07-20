import { Collection } from '@discordjs/collection';
import type { PackageData } from '../../../../src';
import { EntityTypeEnum } from '../../../../src';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import {
  generatePackageName,
  generatePackageUrl,
} from '../../package/PackageValuesFactory';
import { generateTestAnnotation } from '../annotations/TestAnnotation';

const AnnotationsSubPackageName = 'annotations' as const;
const AnnotationsPackageName = generatePackageName(AnnotationsSubPackageName);

function generateEmptyAnnotationsPackage(baseUrl: string): PackageData {
  return {
    entityType: EntityTypeEnum.Package,
    id: AnnotationsPackageName,
    name: AnnotationsPackageName,
    subpackageName: AnnotationsSubPackageName,
    signature: `Package ${AnnotationsPackageName}`,
    description: null,
    url: generatePackageUrl(baseUrl, AnnotationsSubPackageName),
    relatedPackages: new Collection(),
    classes: new Collection(),
    enums: new Collection(),
    interfaces: new Collection(),
    annotations: new Collection(),
  };
}

export function generateAnnotationsPackage(
  baseUrl: string,
  version: FixtureJavaVersion,
): PackageData {
  const annotationsPackage = generateEmptyAnnotationsPackage(baseUrl);

  const testAnnotation = generateTestAnnotation(annotationsPackage, version);
  annotationsPackage.annotations.set(testAnnotation.id, testAnnotation);

  return annotationsPackage;
}
