import { findModifiers } from '../../entities/modifier/Modifier';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialClassData } from '../../partials/class/PartialClassData';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategy } from '../../query/QueryStrategy';
import type { ScrapeCache } from '../cache/ScrapeCache';
import type { BaseObjectScraper } from '../object/BaseObjectScraper';

/** Scrapes data from a class URL to a {@link PartialClassData}. */
export class ClassScraper {
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
  ): Promise<PartialClassData> {
    const { $, fullUrl } = await this.fetcher.fetch(url);
    const base = this.baseObjectScraper.scrape(
      $,
      fullUrl,
      packageData,
      strategy,
    );

    const present = cache.partialClasses.get(base.qualifiedName);
    if (present) {
      return present;
    }

    const modifiersString = base.signature.split(' class ')[0];
    const modifiers = findModifiers(modifiersString);

    const partialExtends = base.partialExtends[0];

    const data: PartialClassData = {
      ...base,
      entityType: EntityTypeEnum.Class,
      modifiers,
      partialExtends,
      id: base.qualifiedName,
    };

    cache.partialClasses.set(data.id, data);

    return data;
  }
}
