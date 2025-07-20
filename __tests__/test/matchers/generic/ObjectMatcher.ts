import { generateErrorMessage } from '../error/EntityMatcherErrorMessage';
import { objectArraysMatch } from './ArrayMatcher';

// "Primitive objects" are objects that only contain primitive values (strings, numbers, booleans, null, undefined).
// Since there are many nullable objects in this project, this accepts nulls as well
export function primitiveObjectsMatch(options: {
  got: object | null;
  expected: object | null;
  path: string[];
}): string | true {
  const baseCheck = baseObjectCheck(options);
  if (baseCheck !== true) {
    return baseCheck;
  }
  if (!options.got || !options.expected) {
    return true;
  }

  const { got, expected } = options;
  const gotRecord = got as Record<string, unknown>;
  const expectedRecord = expected as Record<string, unknown>;
  for (const key of Object.keys(gotRecord)) {
    if (!Object.prototype.hasOwnProperty.call(expected, key)) {
      return generateErrorMessage({
        got: undefined,
        expected: expectedRecord[key],
        path: options.path.concat(key),
      });
    }
    if (typeof gotRecord[key] !== typeof expectedRecord[key]) {
      return generateErrorMessage({
        got: gotRecord[key],
        expected: expectedRecord[key],
        path: options.path.concat(key),
        typeofMissmatch: true,
      });
    }

    if (gotRecord[key] !== expectedRecord[key]) {
      return generateErrorMessage({
        got: gotRecord[key],
        expected: expectedRecord[key],
        path: options.path.concat(key),
      });
    }
  }

  return true;
}

// "Primitive objects" are objects that only contain primitive values (strings, numbers, booleans, null, undefined).
// Since there are many nullable objects in this project, this accepts nulls as well
// Also checks recursively for nested objects and arrays, but this should only be used for primitive "final" values.
export function recursivePrimitiveObjectsMatch(options: {
  got: object | null;
  expected: object | null;
  path: string[];
  primitiveEqualityCheck?: (options: {
    got: unknown;
    expected: unknown;
    key: string;
  }) => string | true;
}): string | true {
  const base = baseObjectCheck(options);
  if (base !== true) {
    return base;
  }
  const { got, expected } = options;

  const equalityCallback =
    options.primitiveEqualityCheck
    ?? ((primitiveOpt) =>
      defaultPrimitiveEqualityCheck({ ...primitiveOpt, path: options.path }));

  const gotRecord = got as Record<string, unknown>;
  const expectedRecord = expected as Record<string, unknown>;
  for (const key of Object.keys(gotRecord)) {
    const gotValue = gotRecord[key];
    const expectedValue = expectedRecord[key];

    if (!Object.prototype.hasOwnProperty.call(expected, key)) {
      return generateErrorMessage({
        got: undefined,
        expected: expectedValue,
        path: options.path.concat(key),
      });
    }
    if (typeof gotValue !== typeof expectedValue) {
      return generateErrorMessage({
        got: gotValue,
        expected: expectedValue,
        path: options.path.concat(key),
        typeofMissmatch: true,
      });
    }

    if (isPlainObject(expectedValue)) {
      if (!isPlainObject(gotValue)) {
        return generateErrorMessage({
          got: gotValue,
          expected: expectedValue,
          path: options.path.concat(key),
        });
      }

      return recursivePrimitiveObjectsMatch({
        got: gotValue as object | null,
        expected: expectedValue as object | null,
        path: options.path.concat(key),
        primitiveEqualityCheck: equalityCallback,
      });
    }

    if (isArray(expectedValue)) {
      if (!isArray(gotValue)) {
        return generateErrorMessage({
          got: gotValue,
          expected: expectedValue,
          path: options.path.concat(key),
        });
      }

      return objectArraysMatch({
        expected: expectedValue as unknown[],
        got: gotValue as unknown[],
        path: options.path.concat(key),
        comparator: (arrOptions) =>
          recursivePrimitiveObjectsMatch({
            got: arrOptions.got as object | null,
            expected: arrOptions.expected as object | null,
            path: options.path.concat(key),
            primitiveEqualityCheck: equalityCallback,
          }),
      });
    }

    const equals = equalityCallback({
      got: gotValue,
      expected: expectedValue,
      key,
    });
    if (equals !== true) {
      return generateErrorMessage({
        got: gotRecord[key],
        expected: expectedRecord[key],
        path: options.path.concat(key),
      });
    }
  }

  return true;
}

function baseObjectCheck(options: {
  got: object | null;
  expected: object | null;
  path: string[];
}): string | true {
  const { got, expected } = options;

  if (!got || !expected) {
    if (got === expected) {
      return true;
    }
    return generateErrorMessage({
      got: got,
      expected: expected,
      path: options.path,
    });
  }

  const gotKeys = Object.keys(got);
  const expectedKeys = Object.keys(expected);

  if (gotKeys.length !== expectedKeys.length) {
    return generateErrorMessage({
      got: gotKeys.length,
      expected: expectedKeys.length,
      path: options.path.concat('length'),
    });
  }

  return true;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && Object.prototype.toString.call(value) === '[object Object]'
  );
}

function isArray(value: unknown): value is unknown[] {
  return (
    Array.isArray(value)
    || Object.prototype.toString.call(value) === '[object Array]'
  );
}

function defaultPrimitiveEqualityCheck(options: {
  got: unknown;
  expected: unknown;
  path: string[];
  key: string;
}): true | string {
  if (options.got === options.expected) {
    return true;
  }
  return generateErrorMessage({
    got: options.got,
    expected: options.expected,
    path: options.path.concat(options.key),
    typeofMissmatch: typeof options.got !== typeof options.expected,
  });
}
