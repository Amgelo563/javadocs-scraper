import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialInterfaceData } from '../../partials/interface/PartialInterfaceData';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategy } from '../../query/QueryStrategy';
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
    strategy: QueryStrategy,
  ): Promise<PartialInterfaceData> {
    const { $, fullUrl } = await this.fetcher.fetch(url);
    const base = this.baseObjectScraper.scrape(
      $,
      fullUrl,
      packageData,
      strategy,
    );

    const present = cache.partialInterfaces.get(base.qualifiedName);
    if (present) {
      return present;
    }

    const data: PartialInterfaceData = {
      ...base,
      id: base.qualifiedName,
      entityType: EntityTypeEnum.Interface,
    };

    cache.partialInterfaces.set(data.id, data);

    return data;
  }
}
