import { Collection } from '@discordjs/collection';
import type { InterfaceData } from '../entities/interface/InterfaceData';
import type { PackageData } from '../entities/package/PackageData';
import { EntityTypeEnum } from '../entities/type/EntityType';
import type { PartialInterfaceData } from '../partials/interface/PartialInterfaceData';
import type { ScrapeCache } from '../scrapers/cache/ScrapeCache';

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

    const fullyPatched: InterfaceData = {
      package: interfacePackage,
      extends: extensions,
      qualifiedName: interfaceData.qualifiedName,
      url: interfaceData.url,
      methods: interfaceData.methods,
      fields: interfaceData.fields,
      typeParameters: interfaceData.typeParameters,
      deprecation: interfaceData.deprecation,
      entityType: EntityTypeEnum.Interface,
      id: interfaceData.id,
      name: interfaceData.name,
      description: interfaceData.description,
      signature: interfaceData.signature,
    };

    interfacePackage.interfaces.set(fullyPatched.id, fullyPatched);

    return fullyPatched;
  }
}
