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

/** Finds a value as an element type, otherwise `null`. */
export function toElementType(value: unknown): ElementType | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmedValue = value.startsWith('value=')
    ? value.substring('value='.length)
    : value;

  return values.has(trimmedValue as ElementType)
    ? (trimmedValue as ElementType)
    : null;
}
