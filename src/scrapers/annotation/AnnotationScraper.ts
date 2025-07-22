import {
  type ElementType,
  toElementTypes,
} from '../../entities/annotation/element/ElementType';
import type { RetentionPolicy } from '../../entities/annotation/retention/RetentionPolicy';
import { toRetentionPolicy } from '../../entities/annotation/retention/RetentionPolicy';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialAnnotationData } from '../../partials/annotation/PartialAnnotationData';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategyBundle } from '../../query/bundle/QueryStrategyBundle';
import type { ScrapeCache } from '../cache/ScrapeCache';
import type { BaseObjectScraper } from '../object/BaseObjectScraper';
import { AnnotationElementScraper } from './AnnotationElementScraper';

export class AnnotationScraper {
  public static readonly AnnotationContentRegex = /\((?<content>[^()]+)\)/;

  protected readonly baseObjectScraper: BaseObjectScraper;

  protected readonly annotationElementScraper: AnnotationElementScraper;

  protected readonly fetcher: Fetcher;

  constructor(
    fetcher: Fetcher,
    baseObjectScraper: BaseObjectScraper,
    annotationElementScraper: AnnotationElementScraper,
  ) {
    this.fetcher = fetcher;
    this.baseObjectScraper = baseObjectScraper;
    this.annotationElementScraper = annotationElementScraper;
  }

  public static create(
    fetcher: Fetcher,
    baseObjectScraper: BaseObjectScraper,
  ): AnnotationScraper {
    const annotationElementScraper = new AnnotationElementScraper();
    return new AnnotationScraper(
      fetcher,
      baseObjectScraper,
      annotationElementScraper,
    );
  }

  public async scrape(
    url: string,
    cache: ScrapeCache,
    packageData: PartialPackageData,
    strategyBundle: QueryStrategyBundle,
  ): Promise<PartialAnnotationData> {
    const { $, fullUrl } = await this.fetcher.fetch(url);
    const base = this.baseObjectScraper.scrape({
      $,
      fullUrl,
      packageData,
      strategyBundle,
      omitMethods: false,
    });

    const present = cache.partialAnnotations.get(base.qualifiedName);
    if (present) {
      return present;
    }

    const elements = this.annotationElementScraper.scrape({
      $object: $,
      objectUrl: fullUrl,
      annotationStrategy: strategyBundle.annotationStrategy,
    });

    const data: PartialAnnotationData = {
      entityType: EntityTypeEnum.Annotation,
      id: base.qualifiedName,
      name: base.name,
      description: base.description,
      signature: base.signature,
      partialPackage: packageData,
      url: base.url,
      qualifiedName: base.qualifiedName,
      deprecation: base.deprecation,
      target: null,
      targets: [],
      retention: null,
      elements,
    };

    const annotationsString = base.signature.split('public')[0]?.trim();
    if (!annotationsString) {
      cache.partialAnnotations.set(data.id, data);
      return data;
    }

    const annotations = annotationsString
      .split(' ')
      .map((annotation) => annotation.trim());

    let retention: RetentionPolicy | null = null;
    let targets: ElementType[] | null = null;

    for (const annotation of annotations) {
      if (retention && targets) break;

      if (annotation.startsWith('@Retention')) {
        const content = this.extractContent(annotation);
        const foundRetention = toRetentionPolicy(content ?? '');
        if (!foundRetention) {
          throw new Error(
            `Invalid retention policy from ${annotation}, tried to parse ${content}`,
          );
        }

        retention = foundRetention;
      }

      if (annotation.startsWith('@Target')) {
        const content = this.extractContent(annotation);
        const foundTargets = toElementTypes(content ?? '');
        if (!foundTargets || !foundTargets.length) {
          throw new Error(
            `Invalid target from ${annotation}, tried to parse ${content}`,
          );
        }

        targets = foundTargets;
      }
    }

    data.retention = retention ?? null;
    data.targets = targets ?? [];
    data.target = targets?.[0] ?? null;

    cache.partialAnnotations.set(data.id, data);
    return data;
  }

  protected extractContent(annotation: string): string | null {
    const match =
      AnnotationScraper.AnnotationContentRegex.exec(annotation)?.groups
        ?.content;
    if (!match) {
      return null;
    }

    return match;
  }
}
