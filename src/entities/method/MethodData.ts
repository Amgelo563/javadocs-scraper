import type { Collection } from '@discordjs/collection';
import type { AccessModifier } from '../access/AccessModifier';
import type { ClassData } from '../class/ClassData';
import type { CommonEntityData } from '../common/CommonEntityData';
import type { DeprecationContent } from '../deprecation/DeprecationContent';
import type { InterfaceData } from '../interface/InterfaceData';
import type { Modifier } from '../modifier/Modifier';
import type { ParameterData } from '../parameter/ParameterData';
import type { EntityTypeEnum } from '../type/EntityType';
import type { MethodReturnData } from './return/MethodReturnData';
import type { MethodTypeParameterData } from './type/MethodTypeParameterData';

/** Data for a Java method. */
export interface MethodData<
  Inheritable extends ClassData | InterfaceData | null,
> extends CommonEntityData<typeof EntityTypeEnum.Method> {
  /** The method's Javadocs URL. */
  url: string;
  /** The method's prototype (eg. `indexOf(java.lang.String, int)`). */
  prototype: string;
  /** The method's parameters, keyed by their {@link ParameterData#name}. */
  parameters: Collection<string, ParameterData>;
  /** The method's type parameters, keyed by their {@link MethodTypeParameterData#name}. */
  typeParameters: Collection<string, MethodTypeParameterData>;
  /** The method's return type. */
  returns: MethodReturnData;
  /** The method's modifiers. */
  modifiers: Modifier[];
  /**
   * The method' deprecation notice, if any.
   *
   * This property is always present if the method is deprecated, regardless
   * of whether it the notice any description or not.
   */
  deprecation: DeprecationContent | null;
  /** The method's applied annotations. */
  annotations: string[];
  /** The parent from where this method was inherited, if any. */
  inheritedFrom: Inheritable;
  /** The method's access modifier. */
  accessModifier: AccessModifier;
}
