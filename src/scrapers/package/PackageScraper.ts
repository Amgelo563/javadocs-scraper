import { Collection } from '@discordjs/collection';
import type { CheerioAPI } from 'cheerio';
import { resolve as urlResolve } from 'url';

import { EntityTypeEnum, toEntityType } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategyBundle } from '../../query/bundle/QueryStrategyBundle';
import type { AnnotationScraper } from '../annotation/AnnotationScraper';
import type { ScrapeCache } from '../cache/ScrapeCache';
import type { ClassScraper } from '../class/ClassScraper';
import type { EnumScraper } from '../enum/EnumScraper';
import type { InterfaceScraper } from '../interface/InterfaceScraper';

/** Scrapes data from a package URL to a {@link PartialPackageData}. */
export class PackageScraper {
  protected readonly fetcher: Fetcher;

  protected readonly interfaceScraper: InterfaceScraper;

  protected readonly enumScraper: EnumScraper;

  protected readonly annotationScraper: AnnotationScraper;

  protected readonly classScraper: ClassScraper;

  constructor(options: {
    fetcher: Fetcher;
    interfaceScraper: InterfaceScraper;
    enumScraper: EnumScraper;
    annotationScraper: AnnotationScraper;
    classScraper: ClassScraper;
  }) {
    this.fetcher = options.fetcher;
    this.interfaceScraper = options.interfaceScraper;
    this.enumScraper = options.enumScraper;
    this.annotationScraper = options.annotationScraper;
    this.classScraper = options.classScraper;
  }

  public async scrape(
    url: string,
    cache: ScrapeCache,
    strategyBundle: QueryStrategyBundle,
  ): Promise<PartialPackageData> {
    const { $, fullUrl } = await this.fetcher.fetch(url);

    const signature =
      strategyBundle.packageStrategy.queryPackageSignatureText($);
    const name = signature.split(' ')[1].trim();

    const $description =
      strategyBundle.packageStrategy.queryPackageDescription($);
    const descriptionHtml = $description.html()?.trim() || null;
    const description = $description.text()?.trim() || null;
    const descriptionObject =
      description || descriptionHtml
        ? {
            html: descriptionHtml,
            text: description,
          }
        : null;

    const relatedPackages = this.findRelatedPackages($, strategyBundle);
    const subpackageName = name.split('.').at(-1) as string;

    const data: PartialPackageData = {
      entityType: EntityTypeEnum.Package,
      id: name,
      name,
      description: descriptionObject,
      signature,
      url: fullUrl,
      subpackageName,
      partialRelatedPackages: relatedPackages,
      relatedPackages: new Collection(),
      classes: new Collection(),
      enums: new Collection(),
      interfaces: new Collection(),
      annotations: new Collection(),
    };

    await this.scrapeContents($, cache, data, strategyBundle);

    cache.partialPackages.set(data.id, data);

    return data;
  }

  protected findRelatedPackages(
    $: CheerioAPI,
    strategyBundle: QueryStrategyBundle,
  ): string[] {
    const relatedPackagesHtml =
      strategyBundle.packageStrategy.queryRelatedPackages($);
    if (!relatedPackagesHtml || relatedPackagesHtml.length === 0) {
      return [];
    }

    const relatedPackages: string[] = [];
    for (const relatedPackage of relatedPackagesHtml) {
      const element = $(relatedPackage).find('a');
      const qualifiedName = element.text();
      if (!qualifiedName) {
        throw new Error(`Name for element ${relatedPackage} not found`);
      }

      relatedPackages.push(qualifiedName);
    }

    return relatedPackages;
  }

  protected async scrapeContents(
    $: CheerioAPI,
    cache: ScrapeCache,
    packageData: PartialPackageData,
    strategyBundle: QueryStrategyBundle,
  ): Promise<void> {
    const contents = strategyBundle.packageStrategy.queryPackageContents($);

    for (const contentElement of contents) {
      const cheerioElement = $(contentElement);
      const title = cheerioElement.attr('title');
      if (!title) {
        continue;
      }

      const url = cheerioElement.attr('href');
      if (!url) {
        throw new Error(`URL for element ${contentElement} not found`);
      }
      const fullURL = urlResolve(packageData.url, url);

      const typeString = title.split(' in ')[0];
      const type = toEntityType(typeString);

      switch (type) {
        case EntityTypeEnum.Interface: {
          await this.interfaceScraper.scrape(
            fullURL,
            cache,
            packageData,
            strategyBundle,
          );
          break;
        }

        case EntityTypeEnum.Enum: {
          await this.enumScraper.scrape(
            fullURL,
            cache,
            packageData,
            strategyBundle,
          );
          break;
        }

        case EntityTypeEnum.Annotation: {
          await this.annotationScraper.scrape(
            fullURL,
            cache,
            packageData,
            strategyBundle,
          );
          break;
        }

        case EntityTypeEnum.Class: {
          await this.classScraper.scrape(
            fullURL,
            cache,
            packageData,
            strategyBundle,
          );
          break;
        }

        case EntityTypeEnum.ExternalObject: {
          break;
        }

        default: {
          throw new Error(`Type ${type} not supported`);
        }
      }
    }
  }
}
