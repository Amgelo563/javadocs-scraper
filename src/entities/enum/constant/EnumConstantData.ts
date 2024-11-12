import type { CommonEntityData } from '../../common/CommonEntityData';
import type { DeprecationContent } from '../../deprecation/DeprecationContent';
import type { EntityTypeEnum } from '../../type/EntityType';

/** Data for a Java enum constant, inside {@link EnumData#constants}. */
export interface EnumConstantData
  extends CommonEntityData<typeof EntityTypeEnum.EnumConstant> {
  /** The enum constant's ordinal. */
  ordinal: number;
  /** The enum constant's deprecation notice, if any. */
  deprecation: DeprecationContent | null;
}
