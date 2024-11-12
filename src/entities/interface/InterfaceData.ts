import type { Collection } from '@discordjs/collection';
import type { CommonEntityData } from '../common/CommonEntityData';
import type { DeprecationContent } from '../deprecation/DeprecationContent';
import type { ExternalEntityData } from '../external/ExternalEntityData';
import type { FieldData } from '../field/FieldData';
import type { MethodData } from '../method/MethodData';
import type { ObjectTypeParameterData } from '../object/ObjectTypeParameterData';
import type { PackageData } from '../package/PackageData';
import type { EntityTypeEnum } from '../type/EntityType';

/** Data for a Java interface. */
export interface InterfaceData
  extends CommonEntityData<typeof EntityTypeEnum.Interface> {
  /** The fully qualified name of the interface (eg. `java.lang.Iterable`). */
  qualifiedName: string;
  /** The interface's Javadocs URL. */
  url: string;

  /** The package that the interface is in. */
  package: PackageData;

  /** The interfaces that this interface extends, keyed by their {@link InterfaceData#qualifiedName} (or {@link ExternalEntityData#qualifiedName}). */
  extends: Collection<string, InterfaceData | ExternalEntityData>;
  /** The interface' methods, keyed by their {@link MethodData#prototype}. */
  methods: Collection<string, MethodData<InterfaceData | null>>;
  /** The interface' fields, keyed by their {@link FieldData#name}. */
  fields: Collection<string, FieldData<InterfaceData | null>>;
  typeParameters: Collection<string, ObjectTypeParameterData>;
  /**
   * The interface's deprecation notice, if any.
   *
   * This property is always present if the interface is deprecated, regardless
   * of whether it the notice any description or not.
   */
  deprecation: DeprecationContent | null;
}
