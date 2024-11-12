/**
 * Enum of annotation retention policies.
 * See https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/RetentionPolicy.html
 */
export const RetentionPolicyEnum = {
  Class: 'CLASS',
  Source: 'SOURCE',
  Runtime: 'RUNTIME',
} as const;

/** Union type of Java annotation retention policies. */
export type RetentionPolicy =
  (typeof RetentionPolicyEnum)[keyof typeof RetentionPolicyEnum];

const values: Set<RetentionPolicy> = new Set(
  Object.values(RetentionPolicyEnum),
);

/** Finds a value as an access modifier, otherwise `null`. */
export function toRetentionPolicy(value: unknown): RetentionPolicy | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.startsWith('value=')
    ? value.substring('value='.length)
    : value;

  return values.has(trimmedValue as RetentionPolicy)
    ? (trimmedValue as RetentionPolicy)
    : null;
}
