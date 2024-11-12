import type { Collection } from '@discordjs/collection';
import type { AnnotationData } from '../annotation/AnnotationData';
import type { ClassData } from '../class/ClassData';
import type { CommonEntityData } from '../common/CommonEntityData';
import type { EnumData } from '../enum/EnumData';
import type { InterfaceData } from '../interface/InterfaceData';
import type { EntityTypeEnum } from '../type/EntityType';

/** Data for a Java package. */
export interface PackageData
  extends CommonEntityData<typeof EntityTypeEnum.Package> {
  /** The package's subpackage name, (eg `concurrent` in `java.util.concurrent`). */
  subpackageName: string;
  /** The package's related packages. */
  relatedPackages: Collection<string, PackageData>;
  /** The package's Javadocs URL. */
  url: string;
  /** The package's classes, keyed by their {@link ClassData#qualifiedName}. */
  classes: Collection<string, ClassData>;
  /** The package's enums, keyed by their {@link EnumData#qualifiedName}. */
  enums: Collection<string, EnumData>;
  /** The package's interfaces, keyed by their {@link InterfaceData#qualifiedName}. */
  interfaces: Collection<string, InterfaceData>;
  /** The package's annotations, keyed by their {@link AnnotationData#qualifiedName}. */
  annotations: Collection<string, AnnotationData>;
}
