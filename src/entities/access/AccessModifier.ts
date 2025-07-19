/** Enum of access modifiers. */
export const AccessModifierEnum = {
  Public: 'public',
  Protected: 'protected',
  Private: 'private',
} as const;

/** Type of access modifiers. */
export type AccessModifier =
  (typeof AccessModifierEnum)[keyof typeof AccessModifierEnum];

const values = new Set(Object.values(AccessModifierEnum));

/** Whether a value is an access modifier. */
export function isAccessModifier(value: unknown): value is AccessModifier {
  return typeof value === 'string' && values.has(value as AccessModifier);
}

/** Checks if a string starts with an access modifier. */
export function startsWithAccessModifier(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  for (const modifier of values) {
    if (value.startsWith(modifier)) {
      return true;
    }
  }

  return false;
}

/** Converts a string to an access modifier, or defaults to {@link AccessModifierEnum.Public}. */
export function findAccessModifier(value: unknown): AccessModifier {
  if (typeof value !== 'string') {
    return AccessModifierEnum.Public;
  }

  const maybeModifier = value.split(' ')[0] as AccessModifier;
  return values.has(maybeModifier) ? maybeModifier : AccessModifierEnum.Public;
}
