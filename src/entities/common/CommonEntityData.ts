import type { NodeContent } from '../node/NodeContent';
import type { EntityType } from '../type/EntityType';

/** Common data for every supported Java entity. */
export type CommonEntityData<Type extends EntityType> = {
  /** The entity's type. */
  entityType: Type;
  /**
   * The entity's unique id (relative to others in the same context). Used as key in collections.
   *
   * Specifically:
   * - In classes, enums, interfaces, external objects and annotations: the `qualifiedName`.
   * - In packages, enum constants, fields, method type parameters, object type parameters and parameters: the `name`.
   * - In methods: the `prototype`, to avoid conflicts with overloaded methods.
   */
  id: string;
  /** The entity's name. */
  name: string;
  /** The entity's description, if any. */
  description: NodeContent | null;
  /** The entity's signature. */
  signature: string;
};
