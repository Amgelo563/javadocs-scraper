import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialInterfaceData } from '../../partials/interface/PartialInterfaceData';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategyBundle } from '../../query/bundle/QueryStrategyBundle';
import type { ScrapeCache } from '../cache/ScrapeCache';
import type { BaseObjectScraper } from '../object/BaseObjectScraper';

/** Scrapes data from an interface URL to a {@link PartialInterfaceData}. */
export class InterfaceScraper {
  protected readonly baseObjectScraper: BaseObjectScraper;

  protected readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher, baseObjectScraper: BaseObjectScraper) {
    this.fetcher = fetcher;
    this.baseObjectScraper = baseObjectScraper;
  }

  public async scrape(
    url: string,
    cache: ScrapeCache,
    packageData: PartialPackageData,
    strategyBundle: QueryStrategyBundle,
  ): Promise<PartialInterfaceData> {
    const { $, fullUrl } = await this.fetcher.fetch(url);
    const base = this.baseObjectScraper.scrape({
      $,
      fullUrl,
      packageData,
      strategyBundle,
    });

    const present = cache.partialInterfaces.get(base.qualifiedName);
    if (present) {
      return present;
    }

    const data: PartialInterfaceData = {
      id: base.qualifiedName,
      entityType: EntityTypeEnum.Interface,
      partialPackage: base.partialPackage,
      partialExtends: base.partialExtends,
      qualifiedName: base.qualifiedName,
      url: base.url,
      methods: base.methods,
      fields: base.fields,
      typeParameters: base.typeParameters,
      deprecation: base.deprecation,
      name: base.name,
      description: base.description,
      signature: base.signature,
    };

    cache.partialInterfaces.set(data.id, data);

    return data;
  }
}
