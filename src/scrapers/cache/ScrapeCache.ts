import { Collection } from '@discordjs/collection';
import type { PartialAnnotationData } from '../../partials/annotation/PartialAnnotationData';
import type { PartialClassData } from '../../partials/class/PartialClassData';
import type { PartialEnumData } from '../../partials/enum/PartialEnumData';
import type { PartialInterfaceData } from '../../partials/interface/PartialInterfaceData';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';

export class ScrapeCache {
  public readonly partialPackages: Collection<string, PartialPackageData> =
    new Collection();

  public readonly partialInterfaces: Collection<string, PartialInterfaceData> =
    new Collection();

  public readonly partialEnums: Collection<string, PartialEnumData> =
    new Collection();

  public readonly partialAnnotations: Collection<
    string,
    PartialAnnotationData
  > = new Collection();

  public readonly partialClasses: Collection<string, PartialClassData> =
    new Collection();
}
