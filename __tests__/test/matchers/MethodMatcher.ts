import type { ClassData, InterfaceData, MethodData } from '../../../src';
import { entitiesMatch } from './CommonEntityMatcher';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { primitiveArraysMatch } from './generic/ArrayMatcher';
import { collectionsMatch } from './generic/CollectionMatcher';
import {
  primitiveObjectsMatch,
  recursivePrimitiveObjectsMatch,
} from './generic/ObjectMatcher';

export function methodsMatch(options: {
  expected: MethodData<InterfaceData | ClassData | null>;
  got: MethodData<InterfaceData | ClassData | null>;
  path: string[];
}): string | true {
  const baseMatch = entitiesMatch({
    ...options,
    path: options.path,
  });
  if (baseMatch !== true) {
    return baseMatch;
  }

  const prototypeMatch = options.got.prototype === options.expected.prototype;
  if (!prototypeMatch) {
    return generateErrorMessage({
      expected: options.expected.prototype,
      got: options.got.prototype,
      path: options.path.concat('prototype'),
    });
  }

  const parametersMatch = collectionsMatch({
    expected: options.expected.parameters,
    got: options.got.parameters,
    path: options.path.concat('parameters'),
    comparator({ expected, got }) {
      const path = options.path.concat(`parameters.get("${expected.id}")`);
      return recursivePrimitiveObjectsMatch({
        expected,
        got,
        path,
      });
    },
  });
  if (parametersMatch !== true) {
    return parametersMatch;
  }

  const typeParametersMatch = collectionsMatch({
    expected: options.expected.typeParameters,
    got: options.got.typeParameters,
    path: options.path.concat('typeParameters'),
    comparator({ expected, got }) {
      const path = options.path.concat(`typeParameters.get("${expected.id}")`);
      return recursivePrimitiveObjectsMatch({
        expected,
        got,
        path,
      });
    },
  });
  if (typeParametersMatch !== true) {
    return typeParametersMatch;
  }

  const returnsMatch = recursivePrimitiveObjectsMatch({
    got: options.got.returns,
    expected: options.expected.returns,
    path: options.path.concat('returns'),
  });
  if (returnsMatch !== true) {
    return returnsMatch;
  }

  const modifiersMatch = primitiveArraysMatch({
    expected: options.expected.modifiers,
    got: options.got.modifiers,
    path: options.path.concat('modifiers'),
  });
  if (modifiersMatch !== true) {
    return modifiersMatch;
  }

  const deprecationMatch = primitiveObjectsMatch({
    got: options.got.deprecation,
    expected: options.expected.deprecation,
    path: options.path.concat('deprecation'),
  });
  if (deprecationMatch !== true) {
    return deprecationMatch;
  }

  const annotationsMatch = primitiveArraysMatch({
    expected: options.expected.annotations,
    got: options.got.annotations,
    path: options.path.concat('annotations'),
  });
  if (annotationsMatch !== true) {
    return annotationsMatch;
  }

  if (options.expected.inheritedFrom !== null) {
    if (options.got.inheritedFrom === null) {
      return generateErrorMessage({
        expected: options.expected.inheritedFrom,
        got: options.got.inheritedFrom,
        path: options.path.concat('inheritedFrom'),
      });
    }

    if (options.expected.inheritedFrom.id !== options.got.inheritedFrom.id) {
      return generateErrorMessage({
        expected: options.expected.inheritedFrom,
        got: options.got.inheritedFrom,
        path: options.path.concat('inheritedFrom'),
      });
    }
  }

  const accessModifierMatch =
    options.got.accessModifier === options.expected.accessModifier;
  if (!accessModifierMatch) {
    return generateErrorMessage({
      expected: options.expected.accessModifier,
      got: options.got.accessModifier,
      path: options.path.concat('accessModifier'),
    });
  }

  return true;
}
