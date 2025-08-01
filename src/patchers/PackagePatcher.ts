import { Collection } from '@discordjs/collection';
import type { PackageData } from '../entities/package/PackageData';
import { EntityTypeEnum } from '../entities/type/EntityType';
import type { PartialPackageData } from '../partials/package/PartialPackageData';
import type { ScrapeCache } from '../scrapers/cache/ScrapeCache';

/** Patches {@link PartialPackageData} to {@link PackageData}. */
export class PackagePatcher {
  public patchPackages(cache: ScrapeCache): Collection<string, PackageData> {
    const packages = new Collection<string, PackageData>();
    for (const [_name, packageData] of cache.partialPackages) {
      const patched = this.patchPackage(cache, packageData);
      packages.set(patched.id, patched);
    }
    return packages;
  }

  protected patchPackage(
    cache: ScrapeCache,
    packageData: PartialPackageData,
  ): PackageData {
    for (const related of packageData.partialRelatedPackages) {
      const relatedPackage = cache.partialPackages.get(related);
      if (!relatedPackage) {
        throw new Error(
          `Package ${related} not found, but is related to ${packageData.id}`,
        );
      }
      packageData.relatedPackages.set(related, relatedPackage);
    }

    return {
      id: packageData.id,
      name: packageData.name,
      description: packageData.description,
      url: packageData.url,
      entityType: EntityTypeEnum.Package,
      annotations: packageData.annotations,
      classes: packageData.classes,
      enums: packageData.enums,
      interfaces: packageData.interfaces,
      relatedPackages: packageData.relatedPackages,
      signature: packageData.signature,
      subpackageName: packageData.subpackageName,
    };
  }
}
