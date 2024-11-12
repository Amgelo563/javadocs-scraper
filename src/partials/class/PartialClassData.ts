import type { ClassData } from '../../entities/class/ClassData';
import type { ExternalEntityData } from '../../entities/external/ExternalEntityData';
import type { PartialPackageData } from '../package/PartialPackageData';

export interface PartialClassData
  extends Omit<ClassData, 'package' | 'extends' | 'implements'> {
  partialPackage: PartialPackageData;
  partialExtends: string | ExternalEntityData | null;
  partialImplements: (string | ExternalEntityData)[];
}
