import type { Collection } from '@discordjs/collection';
import type { CommonEntityData } from '../common/CommonEntityData';
import type { DeprecationContent } from '../deprecation/DeprecationContent';
import type { ExternalEntityData } from '../external/ExternalEntityData';
import type { FieldData } from '../field/FieldData';
import type { InterfaceData } from '../interface/InterfaceData';
import type { MethodData } from '../method/MethodData';
import type { PackageData } from '../package/PackageData';
import type { EntityTypeEnum } from '../type/EntityType';
import type { EnumConstantData } from './constant/EnumConstantData';

/** Data for a Java enum class. */
export interface EnumData extends CommonEntityData<typeof EntityTypeEnum.Enum> {
  /** The fully qualified name of the enum. */
  qualifiedName: string;
  /** The enum's Javadocs URL. */
  url: string;

  /** The enum's package. */
  package: PackageData;
  /** The enum's constants, in their ordinal order, keyed by their {@link EnumConstantData#name}. */
  constants: Collection<string, EnumConstantData>;
  /** The enum's methods, keyed by their {@link MethodData#prototype}. */
  methods: Collection<string, MethodData<null | InterfaceData>>;
  /** The enum's fields, keyed by their {@link FieldData#name}. */
  fields: Collection<string, FieldData<null | InterfaceData>>;

  /** The enum's implemented interfaces, keyed by their {@link InterfaceData#qualifiedName} (or {@link ExternalEntityData#qualifiedName}). */
  implements: Collection<string, InterfaceData | ExternalEntityData>;

  /**
   * The enum's deprecation notice, if any.
   *
   * This property is always present if the enum is deprecated, regardless
   * of whether it the notice any description or not.
   */
  deprecation: DeprecationContent | null;
}
