import type { CommonEntityData } from '../../common/CommonEntityData';
import type { EntityTypeEnum } from '../../type/EntityType';

/** Data for a method's return type in {@link MethodData#returns}. */
export interface MethodReturnData
  extends Omit<
    CommonEntityData<typeof EntityTypeEnum.MethodReturn>,
    'name' | 'signature' | 'id'
  > {
  /** The return type. */
  type: string;
}
