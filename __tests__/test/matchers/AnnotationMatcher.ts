import type { AnnotationData } from '../../../src';
import { entitiesMatch } from './CommonEntityMatcher';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { primitiveArraysMatch } from './generic/ArrayMatcher';
import { collectionsMatch } from './generic/CollectionMatcher';
import {
  primitiveObjectsMatch,
  recursivePrimitiveObjectsMatch,
} from './generic/ObjectMatcher';

export function annotationsMatch(options: {
  expected: AnnotationData;
  got: AnnotationData;
  path: string[];
}): true | string {
  const path = options.path.concat(options.got.name);
  const baseMatch = entitiesMatch({
    ...options,
    path,
  });
  if (baseMatch !== true) {
    return baseMatch;
  }

  const qualifiedNameMatch =
    options.got.qualifiedName === options.expected.qualifiedName;
  if (!qualifiedNameMatch) {
    return generateErrorMessage({
      expected: options.expected.qualifiedName,
      got: options.got.qualifiedName,
      path: path.concat('qualifiedName'),
    });
  }

  const packageMatch = options.got.package.id === options.expected.package.id;
  if (!packageMatch) {
    return generateErrorMessage({
      expected: options.expected.package.id,
      got: options.got.package.id,
      path: path.concat('package', 'id'),
    });
  }

  const targetMatch =
    options.got.target === options.expected.target
    || (options.got.target === null && options.expected.target === null);
  if (!targetMatch) {
    return generateErrorMessage({
      expected: options.expected.target,
      got: options.got.target,
      path: path.concat('target'),
    });
  }

  const targetsMatch = primitiveArraysMatch({
    expected: options.expected.targets,
    got: options.got.targets,
    path: path.concat('targets'),
  });
  if (targetsMatch !== true) {
    return targetsMatch;
  }

  const retentionMatch = options.got.retention === options.expected.retention;
  if (!retentionMatch) {
    return generateErrorMessage({
      expected: options.expected.retention,
      got: options.got.retention,
      path: path.concat('retention'),
    });
  }

  const elementsMatch = collectionsMatch({
    got: options.got.elements,
    expected: options.expected.elements,
    path: path.concat('elements'),
    comparator: ({ got, expected }) => {
      const elementPath = path.concat(`elements.get("${expected.name}")`);
      return recursivePrimitiveObjectsMatch({
        got,
        expected,
        path: elementPath,
        primitiveEqualityCheck: (primitiveOpt) => {
          if (primitiveOpt.key === 'url') {
            return true;
          }
          if (primitiveOpt.got === primitiveOpt.expected) {
            return true;
          }
          return generateErrorMessage({
            got: primitiveOpt.got,
            expected: primitiveOpt.expected,
            path: elementPath.concat(primitiveOpt.key),
            typeofMissmatch:
              typeof primitiveOpt.got !== typeof primitiveOpt.expected,
          });
        },
      });
    },
  });
  if (elementsMatch !== true) {
    return elementsMatch;
  }

  const deprecationMatch = primitiveObjectsMatch({
    got: options.got.deprecation,
    expected: options.expected.deprecation,
    path: path.concat('deprecation'),
  });
  if (deprecationMatch !== true) {
    return deprecationMatch;
  }

  return true;
}
