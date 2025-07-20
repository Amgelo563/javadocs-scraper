import type { CommonEntityData } from '../../../src';
import { type EntityType } from '../../../src';
import type { PrimitiveKeys } from '../types/PrimitiveKeys';
import { generateErrorMessage } from './error/EntityMatcherErrorMessage';
import { primitiveObjectsMatch } from './generic/ObjectMatcher';

export function entitiesMatch(options: {
  got: CommonEntityData<EntityType>;
  expected: CommonEntityData<EntityType>;
  path: string[];
}): string | true {
  const keys: PrimitiveKeys<CommonEntityData<EntityType>> = [
    'entityType',
    'id',
    'name',
    'signature',
  ];

  for (const key of keys) {
    const gotValue = options.got[key];
    const expectedValue = options.expected[key];
    if (gotValue !== expectedValue) {
      return generateErrorMessage({
        path: options.path.concat(key),
        got: gotValue,
        expected: expectedValue,
      });
    }
  }

  const descriptionsMatch = primitiveObjectsMatch({
    got: options.got.description,
    expected: options.expected.description,
    path: options.path.concat('description'),
  });
  if (descriptionsMatch !== true) {
    return descriptionsMatch;
  }

  return true;
}
