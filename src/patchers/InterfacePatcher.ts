import { Collection } from '@discordjs/collection';
import type { InterfaceData } from '../entities/interface/InterfaceData';
import type { PackageData } from '../entities/package/PackageData';
import type { PartialInterfaceData } from '../partials/interface/PartialInterfaceData';
import type { ScrapeCache } from '../scrapers/cache/ScrapeCache';

type PartialWithOptionals = Omit<
  PartialInterfaceData,
  'partialExtends' | 'partialPackage'
> & {
  partialExtends?: PartialInterfaceData['partialExtends'];
  partialPackage?: PartialInterfaceData['partialPackage'];
};

/** Patches {@link PartialInterfaceData} to {@link InterfaceData}. */
export class InterfacePatcher {
  public patchInterfaces(
    cache: ScrapeCache,
    packages: Collection<string, PackageData>,
  ): Collection<string, InterfaceData> {
    const interfaces = new Collection<string, InterfaceData>();
    for (const [_name, interfaceData] of cache.partialInterfaces) {
      const patched = this.patchInterface(
        cache,
        packages,
        interfaces,
        interfaceData,
      );
      interfaces.set(patched.id, patched);
    }
    return interfaces;
  }

  protected patchInterface(
    cache: ScrapeCache,
    packages: Collection<string, PackageData>,
    interfaces: Collection<string, InterfaceData>,
    interfaceData: PartialInterfaceData,
  ): InterfaceData {
    const name = interfaceData.qualifiedName;

    const interfacePackage = packages.get(interfaceData.partialPackage.id);
    if (!interfacePackage) {
      throw new Error(
        `Package ${name} not found, but is package from interface ${name}`,
      );
    }
    delete (interfaceData as PartialWithOptionals).partialPackage;

    const extensions: InterfaceData['extends'] = new Collection();

    for (const extension of interfaceData.partialExtends) {
      if (typeof extension === 'object') {
        extensions.set(extension.id, extension);
        continue;
      }

      let extended = interfaces.get(extension);
      if (!extended) {
        const extendedPartial = cache.partialInterfaces.get(extension);

        if (!extendedPartial) {
          throw new Error(
            `Interface ${extension} not found, but is extended by ${name}`,
          );
        }

        extended = this.patchInterface(
          cache,
          packages,
          interfaces,
          extendedPartial,
        );
      }

      for (const method of extended.methods.values()) {
        const present = interfaceData.methods.get(method.id);
        if (present) {
          present.inheritedFrom = extended;
          continue;
        }
        interfaceData.methods.set(method.id, {
          ...method,
          inheritedFrom: extended,
        });
      }

      for (const field of extended.fields.values()) {
        const present = interfaceData.fields.get(field.id);
        if (present) {
          present.inheritedFrom = extended;
          continue;
        }
        interfaceData.fields.set(field.id, {
          ...field,
          inheritedFrom: extended,
        });
      }
      extensions.set(extended.id, extended);
    }
    delete (interfaceData as PartialWithOptionals).partialExtends;

    return {
      ...interfaceData,
      package: interfacePackage,
      extends: extensions,
    };
  }
}
