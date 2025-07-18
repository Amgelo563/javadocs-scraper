import type { CheerioAPI } from 'cheerio';
import type { AnnotationQueryStrategy } from '../annotation/AnnotationQueryStrategy';
import { LegacyAnnotationQueryStrategy } from '../annotation/legacy/LegacyAnnotationQueryStrategy';
import { ModernAnnotationQueryStrategy } from '../annotation/modern/ModernAnnotationQueryStrategy';
import type { EnumQueryStrategy } from '../enum/EnumQueryStrategy';
import { LegacyEnumQueryStrategy } from '../enum/legacy/LegacyEnumQueryStrategy';
import { ModernEnumQueryStrategy } from '../enum/modern/ModernEnumQueryStrategy';
import type { FieldQueryStrategy } from '../field/FieldQueryStrategy';
import { LegacyFieldQueryStrategy } from '../field/legacy/LegacyFieldQueryStrategy';
import { ModernFieldQueryStrategy } from '../field/modern/ModernFieldQueryStrategy';
import { LegacyMethodQueryStrategy } from '../method/legacy/LegacyMethodQueryStrategy';
import type { MethodQueryStrategy } from '../method/MethodQueryStrategy';
import { ModernMethodQueryStrategy } from '../method/modern/ModernMethodQueryStrategy';
import { LegacyObjectQueryStrategy } from '../object/legacy/LegacyObjectQueryStrategy';
import { ModernObjectQueryStrategy } from '../object/modern/ModernObjectQueryStrategy';
import type { ObjectQueryStrategy } from '../object/ObjectQueryStrategy';
import { LegacyPackageQueryStrategy } from '../package/legacy/LegacyPackageQueryStrategy';
import { ModernPackageQueryStrategy } from '../package/modern/ModernPackageQueryStrategy';
import type { PackageQueryStrategy } from '../package/PackageQueryStrategy';

export interface QueryStrategyBundle {
  /** Strategy for querying packages. */
  packageStrategy: PackageQueryStrategy;

  /** Strategy for querying annotation-specific data. */
  annotationStrategy: AnnotationQueryStrategy;

  /** Strategy for querying objects (classes, interfaces, etc.). */
  objectStrategy: ObjectQueryStrategy;

  /** Strategy for querying enum-specific data. */
  enumStrategy: EnumQueryStrategy;

  /** Strategy for querying fields in objects. */
  fieldStrategy: FieldQueryStrategy;

  /** Strategy for querying methods in objects. */
  methodStrategy: MethodQueryStrategy;
}

/** Factory function to create a QueryStrategyBundle based on the root HTML. */
export type QueryStrategyBundleFactory = (
  $root: CheerioAPI,
) => QueryStrategyBundle;

export const defaultQueryStrategyBundleFactory: QueryStrategyBundleFactory = (
  $root: CheerioAPI,
): QueryStrategyBundle => {
  const legacyPackage = new LegacyPackageQueryStrategy();
  // simple, but tests show that it works well
  if (legacyPackage.queryRootTabs($root).length > 0) {
    return {
      packageStrategy: legacyPackage,
      annotationStrategy: new LegacyAnnotationQueryStrategy(),
      objectStrategy: new LegacyObjectQueryStrategy(),
      enumStrategy: new LegacyEnumQueryStrategy(),
      fieldStrategy: new LegacyFieldQueryStrategy(),
      methodStrategy: new LegacyMethodQueryStrategy(),
    };
  }
  return {
    packageStrategy: new ModernPackageQueryStrategy(),
    annotationStrategy: new ModernAnnotationQueryStrategy(),
    objectStrategy: new ModernObjectQueryStrategy(),
    enumStrategy: new ModernEnumQueryStrategy(),
    fieldStrategy: new ModernFieldQueryStrategy(),
    methodStrategy: new ModernMethodQueryStrategy(),
  };
};
