import type { CommonEntityData } from '../common/CommonEntityData';
import type { EntityTypeEnum } from '../type/EntityType';

/** Data for a method parameter in {@link MethodData#parameters} */
export interface ParameterData
  extends CommonEntityData<typeof EntityTypeEnum.Parameter> {
  /** The parameter's type. */
  type: string;
  /** The parameter's applied annotations. */
  annotations: string[];
}
