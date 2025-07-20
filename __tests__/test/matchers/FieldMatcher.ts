import type { ClassData, FieldData, InterfaceData } from '../../../src';
import { entitiesMatch } from './CommonEntityMatcher';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { primitiveArraysMatch } from './generic/ArrayMatcher';
import { primitiveObjectsMatch } from './generic/ObjectMatcher';

export function fieldsMatch(options: {
  expected: FieldData<InterfaceData | ClassData | null>;
  got: FieldData<InterfaceData | ClassData | null>;
  path: string[];
}): string | true {
  const baseMatch = entitiesMatch({
    ...options,
    path: options.path,
  });
  if (baseMatch !== true) {
    return baseMatch;
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

  const accessModifierMatch =
    options.got.accessModifier === options.expected.accessModifier;
  if (!accessModifierMatch) {
    return generateErrorMessage({
      expected: options.expected.accessModifier,
      got: options.got.accessModifier,
      path: options.path.concat('accessModifier'),
    });
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

  return true;
}
