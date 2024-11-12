import type { CommonEntityData } from '../../common/CommonEntityData';
import type { EntityTypeEnum } from '../../type/EntityType';

/** Data for a method's type parameter in {@link MethodData#typeParameters}. */
export interface MethodTypeParameterData
  extends CommonEntityData<typeof EntityTypeEnum.MethodTypeParameter> {
  /** The type parameter's extension. */
  extends: string | null;
}
