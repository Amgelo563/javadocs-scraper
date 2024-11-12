import type { CommonEntityData } from '../common/CommonEntityData';
import type { EntityTypeEnum } from '../type/EntityType';

/** Data for an object type parameter. */
export interface ObjectTypeParameterData
  extends CommonEntityData<typeof EntityTypeEnum.ObjectTypeParameter> {
  /** The type parameter's extension. */
  extends: string | null;
}
