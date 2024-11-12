import type { CommonEntityData } from '../../common/CommonEntityData';
import type { DeprecationContent } from '../../deprecation/DeprecationContent';
import type { MethodReturnData } from '../../method/return/MethodReturnData';
import type { Modifier } from '../../modifier/Modifier';
import type { EntityTypeEnum } from '../../type/EntityType';

export interface AnnotationElementData
  extends CommonEntityData<typeof EntityTypeEnum.AnnotationElement> {
  /** The element's Javadocs URL. */
  url: string;
  /** The element's return type. */
  returns: MethodReturnData;
  /** The element's modifiers. */
  modifiers: Modifier[];
  /**
   * The element' deprecation notice, if any.
   *
   * This property is always present if the element is deprecated, regardless
   * of whether it the notice any description or not.
   */
  deprecation: DeprecationContent | null;
  /** The element's applied annotations. */
  annotations: string[];
}
