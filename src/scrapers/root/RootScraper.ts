import type { CheerioAPI } from 'cheerio';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategy } from '../../query/QueryStrategy';
import type { ScrapeCache } from '../cache/ScrapeCache';
import type { PackageScraper } from '../package/PackageScraper';

/** The entry point for other scrapers, scraping the root page. */
export class RootScraper {
  protected readonly fetcher: Fetcher;

  protected readonly packageScraper: PackageScraper;

  constructor(fetcher: Fetcher, packageScraper: PackageScraper) {
    this.fetcher = fetcher;
    this.packageScraper = packageScraper;
  }

  public async scrape(
    cache: ScrapeCache,
    queryStrategy: QueryStrategy,
    $: CheerioAPI,
  ): Promise<Map<string, PartialPackageData>> {
    const tabs = queryStrategy.queryRootTabs($);
    const scrapingPromises: Promise<PartialPackageData>[] = [];

    tabs.each((_index, element) => {
      const url = $(element).attr('href');
      if (!url) {
        throw new Error(`URL for element ${element.name} not found`);
      }

      scrapingPromises.push(
        this.packageScraper.scrape(url, cache, queryStrategy),
      );
    });

    const datas = await Promise.all(scrapingPromises);
    const entries = datas.map((data) => [data.name, data] as const);

    return new Map(entries);
  }
}
