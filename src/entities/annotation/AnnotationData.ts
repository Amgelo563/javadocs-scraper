import type { Collection } from '@discordjs/collection';
import type { CommonEntityData } from '../common/CommonEntityData';
import type { DeprecationContent } from '../deprecation/DeprecationContent';
import type { PackageData } from '../package/PackageData';
import type { EntityTypeEnum } from '../type/EntityType';
import type { AnnotationElementData } from './element/AnnotationElementData';
import type { ElementType } from './element/ElementType';
import type { RetentionPolicy } from './retention/RetentionPolicy';

/** Data for a Java annotation interface. */
export interface AnnotationData
  extends CommonEntityData<typeof EntityTypeEnum.Annotation> {
  /** The fully qualified name of the annotation (eg. `java.lang.annotation.Retention`). */
  qualifiedName: string;
  /** The annotation's Javadocs URL. */
  url: string;
  /** The package that the annotation is in. */
  package: PackageData;
  /** The annotation's element type target, if any. */
  target: ElementType | null;
  /**
   * The annotation's retention policy, if specified.
   *
   * Even though this defaults to {@link RetentionPolicyEnum.Class} in Java runtime, given
   * this library only scrapes Javadocs then if it isn't present it'll be set as null
   */
  retention: RetentionPolicy | null;
  /** The annotation's elements, keyed by their {@link AnnotationElementData#name}. */
  elements: Collection<string, AnnotationElementData>;
  /**
   * The annotation's deprecation notice, if any.
   *
   * This property is always present if the annotation is deprecated, regardless
   * of whether it the notice any description or not.
   */
  deprecation: DeprecationContent | null;
}
