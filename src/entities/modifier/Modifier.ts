/** Enum of modifiers. */
export const ModifierEnum = {
  Abstract: 'abstract',
  Static: 'static',
  Final: 'final',
  Transient: 'transient',
  Volatile: 'volatile',
  Synchronized: 'synchronized',
} as const;

/** Type of modifiers. */
export type Modifier = (typeof ModifierEnum)[keyof typeof ModifierEnum];

/** Finds the modifiers in a given value. */
export function findModifiers(value: unknown): Modifier[] {
  const modifiers: Modifier[] = [];
  if (typeof value !== 'string') {
    return modifiers;
  }

  for (const modifier of Object.values(ModifierEnum)) {
    if (value.includes(modifier)) {
      modifiers.push(modifier);
    }
  }

  return modifiers;
}
