import type { PackageData } from '../../../src';
import type { PrimitiveKeys } from '../types/PrimitiveKeys';
import { entitiesMatch } from './CommonEntityMatcher';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { collectionsMatch } from './generic/CollectionMatcher';

export function packagesMatch(options: {
  got: PackageData;
  expected: PackageData;
  path?: string[];
  checkRelated?: boolean;
}): string | true {
  const path = (options.path ?? []).concat(
    `Package ${options.got.subpackageName}#`,
  );
  const baseMatch = entitiesMatch({
    ...options,
    path,
  });
  if (baseMatch !== true) {
    return baseMatch;
  }
  const primitiveKeys: PrimitiveKeys<PackageData> = ['subpackageName'];
  for (const key of primitiveKeys) {
    const gotValue = options.got[key];
    const expectedValue = options.expected[key];
    if (gotValue !== expectedValue) {
      return generateErrorMessage({
        path: path.concat(key),
        got: gotValue,
        expected: expectedValue,
      });
    }
  }

  if (options.got.enums.size !== options.expected.enums.size) {
    return generateErrorMessage({
      path: path.concat('enums', 'size'),
      got: options.got.enums.size,
      expected: options.expected.enums.size,
    });
  }

  if (options.got.classes.size !== options.expected.classes.size) {
    return generateErrorMessage({
      path: path.concat('classes', 'size'),
      got: options.got.classes.size,
      expected: options.expected.classes.size,
    });
  }

  if (options.got.interfaces.size !== options.expected.interfaces.size) {
    return generateErrorMessage({
      path: path.concat('interfaces', 'size'),
      got: options.got.interfaces.size,
      expected: options.expected.interfaces.size,
    });
  }

  if (options.got.annotations.size !== options.expected.annotations.size) {
    return generateErrorMessage({
      path: path.concat('annotations', 'size'),
      got: options.got.annotations.size,
      expected: options.expected.annotations.size,
    });
  }

  if (!options.checkRelated) return true;

  const relatedPackagesMatch = collectionsMatch({
    got: options.got.relatedPackages,
    expected: options.expected.relatedPackages,
    path: path.concat('relatedPackages'),
    comparator: ({ got, expected }) => {
      const relatedPath = path.concat('relatedPackages', got.subpackageName);
      return packagesMatch({
        got,
        expected,
        checkRelated: false,
        path: relatedPath,
      });
    },
  });
  if (!relatedPackagesMatch) {
    return relatedPackagesMatch;
  }

  return true;
}
