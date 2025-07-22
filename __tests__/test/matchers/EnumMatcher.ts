import type { EnumData } from '../../../src';
import { entitiesMatch } from './CommonEntityMatcher';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { fieldsMatch } from './FieldMatcher';
import { collectionsMatch } from './generic/CollectionMatcher';
import {
  primitiveObjectsMatch,
  recursivePrimitiveObjectsMatch,
} from './generic/ObjectMatcher';
import { interfaceExtensionsMatch } from './InterfaceMatcher';
import { methodsMatch } from './MethodMatcher';

export function enumsMatch(options: {
  expected: EnumData;
  got: EnumData;
  path?: string[];
}): string | true {
  const path = (options.path ?? []).concat(options.got.name);
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

  const constantsMatch = collectionsMatch({
    expected: options.expected.constants,
    got: options.got.constants,
    path: path.concat('constants'),
    comparator: ({ got, expected }) => {
      const constantPath = path.concat(`constants.get("${expected.name}")`);
      return recursivePrimitiveObjectsMatch({
        got,
        expected,
        path: constantPath,
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
            path: constantPath.concat(primitiveOpt.key),
            typeofMissmatch:
              typeof primitiveOpt.got !== typeof primitiveOpt.expected,
          });
        },
      });
    },
  });
  if (constantsMatch !== true) {
    return constantsMatch;
  }

  const methodsMatched = collectionsMatch({
    got: options.got.methods,
    expected: options.expected.methods,
    comparator: ({ got, expected }) =>
      methodsMatch({
        got,
        expected,
        path: path.concat(`methods.get("${expected.id}")`),
      }),
    path: path.concat('methods'),
  });
  if (methodsMatched !== true) {
    return methodsMatched;
  }

  const fieldsMatched = collectionsMatch({
    got: options.got.fields,
    expected: options.expected.fields,
    comparator: ({ got, expected }) =>
      fieldsMatch({
        got,
        expected,
        path: path.concat(`fields.get("${expected.id}")`),
      }),
    path: path.concat('fields'),
  });
  if (fieldsMatched !== true) {
    return fieldsMatched;
  }

  const implementsMatch = collectionsMatch({
    got: options.got.implements,
    expected: options.expected.implements,
    path: path.concat('implements'),
    comparator: ({ got, expected }) =>
      interfaceExtensionsMatch({
        got,
        expected,
        path: path.concat('implements'),
      }),
  });
  if (implementsMatch !== true) {
    return implementsMatch;
  }

  const deprecationMatch = primitiveObjectsMatch({
    path: path.concat('deprecation'),
    got: options.got.deprecation,
    expected: options.expected.deprecation,
  });
  if (deprecationMatch !== true) {
    return deprecationMatch;
  }

  return true;
}
