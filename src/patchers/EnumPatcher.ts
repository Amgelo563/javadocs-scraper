import { Collection } from '@discordjs/collection';
import type { EnumData } from '../entities/enum/EnumData';
import type { InterfaceData } from '../entities/interface/InterfaceData';
import type { PackageData } from '../entities/package/PackageData';
import type { PartialEnumData } from '../partials/enum/PartialEnumData';
import type { ScrapeCache } from '../scrapers/cache/ScrapeCache';

/** Patches {@link PartialEnumData} to {@link EnumData}. */
export class EnumPatcher {
  public patchEnums(
    cache: ScrapeCache,
    packages: Collection<string, PackageData>,
    interfaces: Collection<string, InterfaceData>,
  ): Collection<string, EnumData> {
    const enums = new Collection<string, EnumData>();
    for (const [_name, enumData] of cache.partialEnums) {
      const patched = this.patchEnum(packages, interfaces, enumData);
      enums.set(patched.id, patched);
    }
    return enums;
  }

  protected patchEnum(
    packages: Collection<string, PackageData>,
    interfaces: Collection<string, InterfaceData>,
    enumData: PartialEnumData,
  ): EnumData {
    const name = enumData.qualifiedName;

    const enumPackage = packages.get(enumData.partialPackage.id);
    if (!enumPackage) {
      throw new Error(
        `Package ${name} not found, but is package from enum ${name}`,
      );
    }

    const implementations: EnumData['implements'] = new Collection();

    for (const implementation of enumData.partialImplements) {
      if (typeof implementation === 'object') {
        implementations.set(implementation.id, implementation);
        continue;
      }

      const implemented = interfaces.get(implementation);
      if (!implemented) {
        throw new Error(
          `Interface ${implementation} not found, but is implemented by ${name}`,
        );
      }

      for (const method of implemented.methods.values()) {
        const present = enumData.methods.get(method.id);
        if (present) {
          present.inheritedFrom = implemented;
          continue;
        }
        enumData.methods.set(method.id, {
          ...method,
          inheritedFrom: implemented,
        });
      }

      for (const field of implemented.fields.values()) {
        if (enumData.fields.has(field.id)) continue;
        enumData.fields.set(field.id, {
          ...field,
          inheritedFrom: implemented,
        });
      }

      implementations.set(implemented.id, implemented);
    }

    return {
      ...enumData,
      package: enumPackage,
      implements: implementations,
    };
  }
}
