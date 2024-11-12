import type { Collection } from '@discordjs/collection';
import type { CommonEntityData } from '../common/CommonEntityData';
import type { DeprecationContent } from '../deprecation/DeprecationContent';
import type { ExternalEntityData } from '../external/ExternalEntityData';
import type { FieldData } from '../field/FieldData';
import type { InterfaceData } from '../interface/InterfaceData';
import type { MethodData } from '../method/MethodData';
import type { Modifier } from '../modifier/Modifier';
import type { ObjectTypeParameterData } from '../object/ObjectTypeParameterData';
import type { PackageData } from '../package/PackageData';
import type { EntityTypeEnum } from '../type/EntityType';

/** Data for a Java class. */
export interface ClassData
  extends CommonEntityData<typeof EntityTypeEnum.Class> {
  /** The fully qualified name of the class (eg. `java.lang.String`). */
  qualifiedName: string;
  /** The class's Javadocs URL. */
  url: string;
  /** The package that the class is in. */
  package: PackageData;
  /** The class' modifiers. */
  modifiers: Modifier[];
  /** The class' methods, keyed by their {@link MethodData#prototype}. */
  methods: Collection<string, MethodData<ClassData | InterfaceData | null>>;
  /** The class' fields, keyed by their `{@link FieldData#qualifiedName}`. */
  fields: Collection<string, FieldData<ClassData | InterfaceData | null>>;
  /** The interfaces that this class implements, keyed by their {@link InterfaceData#qualifiedName} (or {@link ExternalEntityData#qualifiedName}). */
  implements: Collection<string, InterfaceData | ExternalEntityData>;
  /** The class that this class extends, if any. */
  extends: ClassData | ExternalEntityData | null;
  /**
   * The class' deprecation notice, if any.
   *
   * This property is always present if the class is deprecated, regardless
   * of whether it the notice any description or not.
   */
  deprecation: DeprecationContent | null;
  /** The class' type parameters, keyed by their {@link ObjectTypeParameterData#name}. */
  typeParameters: Collection<string, ObjectTypeParameterData>;
}
