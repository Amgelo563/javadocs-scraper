import type { EnumData } from '../../entities/enum/EnumData';
import type { ExternalEntityData } from '../../entities/external/ExternalEntityData';
import type { PartialPackageData } from '../package/PartialPackageData';

/** A partial {@link EnumData}. */
export interface PartialEnumData
  extends Omit<EnumData, 'package' | 'implements'> {
  partialPackage: PartialPackageData;
  /** Can be an interface's fully qualified name, or an {@link ExternalEntityData}. */
  partialImplements: (string | ExternalEntityData)[];
}
