import { Collection } from '@discordjs/collection';
import type { ClassData } from '../entities/class/ClassData';
import type { InterfaceData } from '../entities/interface/InterfaceData';
import type { PackageData } from '../entities/package/PackageData';
import type { PartialClassData } from '../partials/class/PartialClassData';
import type { ScrapeCache } from '../scrapers/cache/ScrapeCache';

export class ClassPatcher {
  public patchClasses(
    cache: ScrapeCache,
    packages: Collection<string, PackageData>,
    interfaces: Collection<string, InterfaceData>,
  ): Collection<string, ClassData> {
    const classes = new Collection<string, ClassData>();
    for (const [_name, classData] of cache.partialClasses) {
      const patched = this.patchClass(
        cache,
        packages,
        interfaces,
        classes,
        classData,
      );
      classes.set(patched.id, patched);
    }
    return classes;
  }

  protected patchClass(
    cache: ScrapeCache,
    packages: Collection<string, PackageData>,
    interfaces: Collection<string, InterfaceData>,
    classes: Collection<string, ClassData>,
    classData: PartialClassData,
  ): ClassData {
    const packageData = packages.get(classData.partialPackage.id);
    if (!packageData) {
      throw new Error(
        `Package ${classData.qualifiedName} not found, but is package from class ${classData.qualifiedName}`,
      );
    }

    let extension: ClassData['extends'] = null;

    const partialExtension = classData.partialExtends;
    if (partialExtension) {
      if (typeof partialExtension === 'object') {
        extension = partialExtension;
      } else {
        let extended = classes.get(partialExtension);
        if (!extended) {
          const extendedPartial = cache.partialClasses.get(partialExtension);

          if (!extendedPartial) {
            throw new Error(
              `Class ${partialExtension} not found, but is extended by ${classData.id}`,
            );
          }

          extended = this.patchClass(
            cache,
            packages,
            interfaces,
            classes,
            extendedPartial,
          );
        }

        for (const method of extended.methods.values()) {
          if (classData.methods.has(method.id)) continue;
          classData.methods.set(method.id, {
            ...method,
            inheritedFrom: extended,
          });
        }

        for (const field of extended.fields.values()) {
          if (classData.fields.has(field.id)) continue;
          classData.fields.set(field.id, {
            ...field,
            inheritedFrom: extended,
          });
        }

        extension = extended;
      }
    }

    const implementations: ClassData['implements'] = new Collection();
    for (const implementation of classData.partialImplements) {
      if (typeof implementation === 'object') {
        implementations.set(implementation.qualifiedName, implementation);
        continue;
      }

      const implemented = interfaces.get(implementation);
      if (!implemented) {
        throw new Error(
          `Interface ${implementation} not found, but is implemented by class ${classData.id}`,
        );
      }

      for (const method of implemented.methods.values()) {
        if (classData.methods.has(method.signature)) continue;
        classData.methods.set(method.signature, {
          ...method,
          inheritedFrom: implemented,
        });
      }

      for (const field of implemented.fields.values()) {
        if (classData.fields.has(field.signature)) continue;
        classData.fields.set(field.signature, {
          ...field,
          inheritedFrom: implemented,
        });
      }

      implementations.set(implemented.qualifiedName, implemented);
    }

    return {
      ...classData,
      package: packageData,
      extends: extension,
      implements: implementations,
    };
  }
}
