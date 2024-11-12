import { Collection } from '@discordjs/collection';
import type { InterfaceData } from '../entities/interface/InterfaceData';
import type { PackageData } from '../entities/package/PackageData';
import type { PartialInterfaceData } from '../partials/interface/PartialInterfaceData';
import type { ScrapeCache } from '../scrapers/cache/ScrapeCache';

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

    const extensions: InterfaceData['extends'] = new Collection();

    for (const extension of interfaceData.partialExtends) {
      if (typeof extension === 'object') {
        extensions.set(extension.qualifiedName, extension);
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
        if (interfaceData.methods.has(method.id)) continue;
        interfaceData.methods.set(method.id, {
          ...method,
          inheritedFrom: extended,
        });
      }

      for (const field of extended.fields.values()) {
        if (interfaceData.fields.has(field.id)) continue;
        interfaceData.fields.set(field.id, {
          ...field,
          inheritedFrom: extended,
        });
      }
      extensions.set(extended.qualifiedName, extended);
    }

    return {
      ...interfaceData,
      package: interfacePackage,
      extends: extensions,
    };
  }
}
