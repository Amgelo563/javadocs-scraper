/**
 * Enum of all supported entity types.
 *
 * Useful for {@link https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions discriminated unions}.
 */
export const EntityTypeEnum = {
  ExternalObject: 'externalObject',
  Package: 'package',
  Class: 'class',
  Interface: 'interface',
  Enum: 'enum',
  EnumConstant: 'enumConstant',
  Annotation: 'annotationInterface',
  AnnotationElement: 'annotationElement',
  Field: 'field',
  Method: 'method',
  MethodReturn: 'methodReturn',
  Parameter: 'parameter',
  MethodTypeParameter: 'methodTypeParameter',
  ObjectTypeParameter: 'objectTypeParameter',
} as const;

/** Type of entity types. */
export type EntityType = (typeof EntityTypeEnum)[keyof typeof EntityTypeEnum];

/** Converts a string to an entity type, or returns `null` if unknown. */
export function toEntityType(type: string): EntityType | null {
  switch (type) {
    case 'class or interface':
      return EntityTypeEnum.ExternalObject;

    case 'enum':
    case 'enum class':
      return EntityTypeEnum.Enum;

    case 'annotation':
    case 'annotation interface':
      return EntityTypeEnum.Annotation;

    case 'class':
      return EntityTypeEnum.Class;

    case 'interface':
      return EntityTypeEnum.Interface;

    default:
      return null;
  }
}
