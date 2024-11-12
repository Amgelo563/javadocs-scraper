import type { ExternalEntityData } from '../../entities/external/ExternalEntityData';
import type { InterfaceData } from '../../entities/interface/InterfaceData';
import type { PartialPackageData } from '../package/PartialPackageData';

export interface PartialInterfaceData
  extends Omit<InterfaceData, 'package' | 'extends'> {
  partialPackage: PartialPackageData;
  partialExtends: (string | ExternalEntityData)[];
}
