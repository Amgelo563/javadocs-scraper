import type { EnumData } from '../../entities/enum/EnumData';
import type { ExternalEntityData } from '../../entities/external/ExternalEntityData';
import type { PartialPackageData } from '../package/PartialPackageData';

export interface PartialEnumData
  extends Omit<EnumData, 'package' | 'implements'> {
  partialPackage: PartialPackageData;
  partialImplements: (string | ExternalEntityData)[];
}
