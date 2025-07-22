import type { Collection } from '@discordjs/collection';
import { generateErrorMessage } from '../error/EntityMatcherErrorMessage';

// This particular implementation doesn't care about entry order
export function collectionsMatch<K, V>(options: {
  got: Collection<K, V>;
  expected: Collection<K, V>;
  comparator: (options: { got: V; expected: V; key: string }) => string | true;
  path?: string[];
}): string | true {
  const { got, expected, comparator, path = [] } = options;
  if (got.size !== expected.size) {
    return generateErrorMessage({
      path: path.concat('size'),
      expected: expected.size,
      got: got.size,
      extra: `Got ${got.size} keys: ${Array.from(got.keys()).map(String).join(', ')}`,
    });
  }

  for (const [expectedKey, expectedValue] of expected.entries()) {
    const gotValue = got.get(expectedKey);
    if (gotValue === undefined) {
      const gotKeys = Array.from(got.keys());
      return generateErrorMessage({
        path: path.concat(`get("${String(expectedKey)}")`),
        expected: expectedValue,
        got: undefined,
        extra: `Got ${gotKeys.length} keys: ${gotKeys.map(String).join(', ')}`,
      });
    }

    const match = comparator({
      got: gotValue,
      expected: expectedValue,
      key: String(expectedKey),
    });
    if (match !== true) {
      return match;
    }
  }

  return true;
}
