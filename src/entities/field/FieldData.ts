import type { AccessModifier } from '../access/AccessModifier';
import type { ClassData } from '../class/ClassData';
import type { CommonEntityData } from '../common/CommonEntityData';
import type { DeprecationContent } from '../deprecation/DeprecationContent';
import type { InterfaceData } from '../interface/InterfaceData';
import type { Modifier } from '../modifier/Modifier';
import type { EntityTypeEnum } from '../type/EntityType';

/** Data for a Java field. */
export interface FieldData<Parent extends ClassData | InterfaceData | null>
  extends CommonEntityData<typeof EntityTypeEnum.Field> {
  /** The field's type. */
  type: string;
  /** The field's modifiers. */
  modifiers: Modifier[];
  /** The field's Javadocs URL. */
  url: string;
  /**
   * The field's deprecation notice, if any.
   *
   * This property is always present if the field is deprecated, regardless
   * of whether it the notice any description or not.
   */
  deprecation: DeprecationContent | null;
  /** The field's access modifier. */
  accessModifier: AccessModifier;
  /** The parent from where this field was inherited, if any. */
  inheritedFrom: Parent;
}
