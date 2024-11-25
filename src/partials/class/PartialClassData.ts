import type { ClassData } from '../../entities/class/ClassData';
import type { ExternalEntityData } from '../../entities/external/ExternalEntityData';
import type { PartialPackageData } from '../package/PartialPackageData';

/** A partial {@link ClassData}. */
export interface PartialClassData
  extends Omit<ClassData, 'package' | 'extends' | 'implements'> {
  partialPackage: PartialPackageData;
  /** Can be a class's fully qualified name, or an {@link ExternalEntityData}. */
  partialExtends: string | ExternalEntityData | null;
  /** Can be an interface's fully qualified name, or an {@link ExternalEntityData}. */
  partialImplements: (string | ExternalEntityData)[];
}
