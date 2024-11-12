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

/** Converts a string to an access modifier, or defaults to {@link AccessModifierEnum.Public}. */
export function findAccessModifier(value: unknown): AccessModifier {
  if (typeof value !== 'string') {
    return AccessModifierEnum.Public;
  }

  const maybeModifier = value.split(' ')[0] as AccessModifier;
  return values.has(maybeModifier) ? maybeModifier : AccessModifierEnum.Public;
}
