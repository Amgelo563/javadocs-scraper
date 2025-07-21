import type { ExternalEntityData } from '../../../src';
import { EntityTypeEnum } from '../../../src';

export function generateJ7ComparatorInterface(): ExternalEntityData {
  return {
    entityType: EntityTypeEnum.ExternalObject,
    id: 'java.util.Comparator',
    name: 'java.util.Comparator',
    qualifiedName: 'java.util.Comparator',
    description: null,
    url: '',
    signature: 'Comparator',
  };
}
