import { Collection } from '@discordjs/collection';
import type { EnumConstantData } from '../../entities/enum/constant/EnumConstantData';
import type { FieldData } from '../../entities/field/FieldData';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialEnumData } from '../../partials/enum/PartialEnumData';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategyBundle } from '../../query/bundle/QueryStrategyBundle';
import type { ScrapeCache } from '../cache/ScrapeCache';
import type { FieldScraper } from '../field/FieldScraper';
import type { BaseObjectScraper } from '../object/BaseObjectScraper';

/** Scrapes data from an enum URL to a {@link PartialEnumData}. */
export class EnumScraper {
  protected readonly baseObjectScraper: BaseObjectScraper;

  protected readonly fetcher: Fetcher;

  protected readonly fieldScraper: FieldScraper;

  constructor(
    fetcher: Fetcher,
    baseObjectScraper: BaseObjectScraper,
    fieldScraper: FieldScraper,
  ) {
    this.fetcher = fetcher;
    this.baseObjectScraper = baseObjectScraper;
    this.fieldScraper = fieldScraper;
  }

  public async scrape(
    url: string,
    cache: ScrapeCache,
    packageData: PartialPackageData,
    strategyBundle: QueryStrategyBundle,
  ): Promise<PartialEnumData> {
    const { $, fullUrl } = await this.fetcher.fetch(url);
    const base = this.baseObjectScraper.scrape(
      $,
      fullUrl,
      packageData,
      strategyBundle,
      EntityTypeEnum.Enum,
    );
    delete (base as { partialExtends?: unknown[] }).partialExtends;

    const present = cache.partialEnums.get(base.qualifiedName);
    if (present) {
      return present;
    }

    const constantTables =
      strategyBundle.enumStrategy.queryEnumConstantTables($);
    const constantsAsFields = this.fieldScraper.scrape(
      $,
      constantTables,
      fullUrl,
      strategyBundle.fieldStrategy,
    );

    const constants = new Collection<string, EnumConstantData>();
    for (const [name, field] of constantsAsFields) {
      const constant = this.fieldToConstant(field, constants.size);
      constants.set(name, constant);
    }

    const data: PartialEnumData = {
      ...base,
      entityType: EntityTypeEnum.Enum,
      constants,
      id: base.qualifiedName,
    };

    cache.partialEnums.set(data.id, data);

    return data;
  }

  protected fieldToConstant(
    parameter: FieldData<null>,
    index: number,
  ): EnumConstantData {
    return {
      entityType: EntityTypeEnum.EnumConstant,
      id: parameter.id,
      name: parameter.name,
      description: parameter.description,
      signature: parameter.signature,
      url: parameter.url,
      deprecation: parameter.deprecation,
      /** there are two kinds of errors, off by one errors */
      ordinal: index + 1,
    };
  }
}
