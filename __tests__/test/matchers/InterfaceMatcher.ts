import type { ExternalEntityData, InterfaceData } from '../../../src';
import { EntityTypeEnum } from '../../../src';
import { entitiesMatch } from './CommonEntityMatcher';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { fieldsMatch } from './FieldMatcher';
import { collectionsMatch } from './generic/CollectionMatcher';
import {
  primitiveObjectsMatch,
  recursivePrimitiveObjectsMatch,
} from './generic/ObjectMatcher';
import { methodsMatch } from './MethodMatcher';

export function interfacesMatch(options: {
  expected: InterfaceData;
  got: InterfaceData;
  path: string[];
}): string | true {
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

  // actual in-depth comparison is done by the package matcher
  const packageMatch = options.got.package.id === options.expected.package.id;
  if (!packageMatch) {
    return generateErrorMessage({
      expected: options.expected.package.id,
      got: options.got.package.id,
      path: path.concat('package', 'id'),
    });
  }

  const extendsMatch = collectionsMatch({
    got: options.got.extends,
    expected: options.expected.extends,
    path: path.concat('extends'),
    comparator: ({ got, expected }) =>
      got.id === expected.id && got.entityType === expected.entityType
        ? true
        : generateErrorMessage({
            expected: expected.id,
            got: got.id,
            path: path.concat('extends', `get("${expected.id}")`),
          }),
  });
  if (extendsMatch !== true) {
    return extendsMatch;
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

export function interfaceExtensionsMatch(options: {
  got: InterfaceData | ExternalEntityData;
  expected: InterfaceData | ExternalEntityData;
  path: string[];
}): string | true {
  const { got, expected, path } = options;
  const extendsPath = path.concat(got.name);
  if (got.entityType !== expected.entityType) {
    return generateErrorMessage({
      path: extendsPath.concat('entityType'),
      got: got.entityType,
      expected: expected.entityType,
    });
  }
  if (got.entityType === EntityTypeEnum.Interface) {
    // actual in-depth comparison is done by the top level interface matcher
    const match = got.id === expected.id;
    if (!match) {
      return generateErrorMessage({
        expected: expected.id,
        got: got.id,
        path: path.concat('id'),
      });
    }
    return true;
  }
  return primitiveObjectsMatch({
    got: got,
    expected: expected,
    path: extendsPath,
  });
}
