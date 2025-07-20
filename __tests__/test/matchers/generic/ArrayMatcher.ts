import { generateErrorMessage } from '../error/EntityMatcherErrorMessage';

// This particular implementation doesn't care about value order
export function objectArraysMatch<T>(options: {
  expected: T[];
  got: T[];
  path: string[];
  comparator: (options: {
    got: T;
    expected: T;
    index: number;
  }) => string | true;
}) {
  const { expected, got, path } = options;
  const base = baseMatch({
    expected,
    got,
    path,
  });
  if (base !== true) {
    return base;
  }

  for (const [index, expectedValue] of expected.entries()) {
    const gotIndex = got.indexOf(expectedValue);
    if (gotIndex === -1) {
      return generateErrorMessage({
        path: path.concat(`.indexOf(${String(expectedValue)})`),
        expected: 'Not -1',
        got: -1,
      });
    }

    const gotValue = got[gotIndex];
    const match = options.comparator({
      got: gotValue,
      expected: expectedValue,
      index,
    });

    if (match !== true) {
      return match;
    }
  }

  return true;
}

export function primitiveArraysMatch(options: {
  expected: (string | number | boolean)[];
  got: (string | number | boolean)[];
  path: string[];
}): string | true {
  const { expected, got, path } = options;
  const base = baseMatch({
    expected,
    got,
    path,
  });
  if (base !== true) {
    return base;
  }

  for (const expectedValue of expected) {
    const gotIndex = got.indexOf(expectedValue);
    if (gotIndex === -1) {
      return generateErrorMessage({
        path: path.concat(String(expectedValue)),
        expected: expectedValue,
        got: undefined,
      });
    }

    const gotValue = got[gotIndex];
    if (gotValue !== expectedValue) {
      return generateErrorMessage({
        path: path.concat(String(expectedValue)),
        expected: expectedValue,
        got: undefined,
      });
    }
  }

  return true;
}

function baseMatch(options: {
  expected: unknown[];
  got: unknown[];
  path: string[];
}): string | true {
  if (options.got.length !== options.expected.length) {
    return generateErrorMessage({
      path: options.path.concat('length'),
      expected: options.expected.length,
      got: options.got.length,
    });
  }

  return true;
}
