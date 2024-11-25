/**
 * Enum of element types (annotation targets).
 * See https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html
 */
export const ElementTypeEnum = {
  AnnotationType: 'ANNOTATION_TYPE',
  Constructor: 'CONSTRUCTOR',
  Field: 'FIELD',
  LocalVariable: 'LOCAL_VARIABLE',
  Method: 'METHOD',
  Module: 'MODULE',
  Package: 'PACKAGE',
  Parameter: 'PARAMETER',
  RecordComponent: 'RECORD_COMPONENT',
  Type: 'TYPE',
  TypeParameter: 'TYPE_PARAMETER',
  TypeUse: 'TYPE_USE',
} as const;

/** Union type of element types. */
export type ElementType =
  (typeof ElementTypeEnum)[keyof typeof ElementTypeEnum];

const values: Set<ElementType> = new Set(Object.values(ElementTypeEnum));

/** Finds a value's element types, otherwise `null`. */
export function toElementTypes(value: unknown): ElementType[] | null {
  if (typeof value !== 'string') {
    return null;
  }
  let trimmedValue = value;

  if (trimmedValue.startsWith('value=')) {
    trimmedValue = trimmedValue.substring('value='.length);
  }

  if (trimmedValue.startsWith('{')) {
    trimmedValue = trimmedValue.substring(1, trimmedValue.length - 1);
  }
  if (trimmedValue.endsWith('}')) {
    trimmedValue = trimmedValue.substring(0, trimmedValue.length - 1);
  }

  return trimmedValue
    .split(',')
    .filter((value): value is ElementType =>
      values.has(value.trim() as ElementType),
    );
}
