import type { PackageData } from '../../entities/package/PackageData';

export interface PartialPackageData extends PackageData {
  partialRelatedPackages: string[];
}
