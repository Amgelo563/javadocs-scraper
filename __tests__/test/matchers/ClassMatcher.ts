import type { ClassData } from '../../../src';
import { EntityTypeEnum } from '../../../src';
import { entitiesMatch } from './CommonEntityMatcher';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { fieldsMatch } from './FieldMatcher';
import { primitiveArraysMatch } from './generic/ArrayMatcher';
import { collectionsMatch } from './generic/CollectionMatcher';
import {
  primitiveObjectsMatch,
  recursivePrimitiveObjectsMatch,
} from './generic/ObjectMatcher';
import { interfaceExtensionsMatch } from './InterfaceMatcher';
import { methodsMatch } from './MethodMatcher';

export function classesMatch(options: {
  expected: ClassData;
  got: ClassData;
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

  // actual in-depth comparison is done by the package matcher
  const packageMatch = options.got.package.id === options.expected.package.id;
  if (!packageMatch) {
    return generateErrorMessage({
      expected: options.expected.package.id,
      got: options.got.package.id,
      path: path.concat('package', 'id'),
    });
  }

  const modifiersMatch = primitiveArraysMatch({
    got: options.got.modifiers,
    expected: options.expected.modifiers,
    path: path.concat('modifiers'),
  });
  if (modifiersMatch !== true) {
    return modifiersMatch;
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

  const extendsMatch = extensionsMatch({
    got: options.got.extends,
    expected: options.expected.extends,
    path: path.concat('extends'),
  });
  if (extendsMatch !== true) {
    return extendsMatch;
  }

  const typeParametersMatch = collectionsMatch({
    got: options.got.typeParameters,
    expected: options.expected.typeParameters,
    comparator: ({ got, expected }) =>
      recursivePrimitiveObjectsMatch({
        got,
        expected,
        path: path.concat(`typeParameters.get("${expected.id}")`),
      }),
    path: path.concat('typeParameters'),
  });
  if (typeParametersMatch !== true) {
    return typeParametersMatch;
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

function extensionsMatch(options: {
  expected: ClassData['extends'];
  got: ClassData['extends'];
  path: string[];
}): string | true {
  if (options.got === null && options.expected === null) {
    return true;
  }

  if (
    options.got === null
    || options.expected === null
    || options.got.entityType !== options.expected.entityType
  ) {
    return generateErrorMessage({
      expected: options.expected ?? 'null',
      got: options.got ?? 'null',
      path: options.path,
    });
  }

  switch (options.expected.entityType) {
    case EntityTypeEnum.Class:
      if (options.got.id !== options.expected.id) {
        return generateErrorMessage({
          expected: options.expected,
          got: options.got,
          path: options.path,
        });
      }
      break;
    case EntityTypeEnum.ExternalObject:
      return primitiveObjectsMatch({
        got: options.got,
        expected: options.expected,
        path: options.path,
      });
  }

  return true;
}
