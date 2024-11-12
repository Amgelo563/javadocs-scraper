import type { CommonEntityData } from '../common/CommonEntityData';
import type { EntityTypeEnum } from '../type/EntityType';

/** Data for an external entity, whose details cannot be fully scraped. */
export interface ExternalEntityData
  extends CommonEntityData<typeof EntityTypeEnum.ExternalObject> {
  /** External entities' descriptions cannot be scraped. */
  description: null;
  /** The entity's fully qualified name. */
  qualifiedName: string;
  /** The entity's Javadocs URL. */
  url: string;
}
