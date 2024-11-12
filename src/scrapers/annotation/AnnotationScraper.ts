import { Collection } from '@discordjs/collection';
import type { AnnotationElementData } from '../../entities/annotation/element/AnnotationElementData';
import type { ElementType } from '../../entities/annotation/element/ElementType';
import { toElementType } from '../../entities/annotation/element/ElementType';
import type { RetentionPolicy } from '../../entities/annotation/retention/RetentionPolicy';
import { toRetentionPolicy } from '../../entities/annotation/retention/RetentionPolicy';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialAnnotationData } from '../../partials/annotation/PartialAnnotationData';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategy } from '../../query/QueryStrategy';
import type { ScrapeCache } from '../cache/ScrapeCache';
import type { BaseObjectScraper } from '../object/BaseObjectScraper';

export class AnnotationScraper {
  public static readonly AnnotationContentRegex = /\((?<content>[^()]+)\)/;

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
  ): Promise<PartialAnnotationData> {
    const { $, fullUrl } = await this.fetcher.fetch(url);
    const base = this.baseObjectScraper.scrape(
      $,
      fullUrl,
      packageData,
      strategy,
    );

    const present = cache.partialAnnotations.get(base.qualifiedName);
    if (present) {
      return present;
    }

    const elements: Collection<string, AnnotationElementData> =
      new Collection();
    for (const method of base.methods.values()) {
      const data = {
        ...method,
        entityType: EntityTypeEnum.AnnotationElement,
        id: method.name,
      };

      elements.set(data.id, data);
    }

    const annotationsString = base.signature.split('public')[0]?.trim();
    if (!annotationsString) {
      const data: PartialAnnotationData = {
        ...base,
        entityType: EntityTypeEnum.Annotation,
        target: null,
        retention: null,
        elements,
        id: base.qualifiedName,
      };

      cache.partialAnnotations.set(data.id, data);
      return data;
    }

    const annotations = annotationsString
      .split(' ')
      .map((annotation) => annotation.trim());

    let retention: RetentionPolicy | null = null;
    let target: ElementType | null = null;

    for (const annotation of annotations) {
      if (retention && target) break;

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
        const foundTarget = toElementType(content ?? '');
        if (!content) {
          throw new Error(
            `Invalid target from ${annotation}, tried to parse ${content}`,
          );
        }

        target = foundTarget;
      }
    }

    const data: PartialAnnotationData = {
      ...base,
      entityType: EntityTypeEnum.Annotation,
      target,
      retention,
      elements,
      id: base.qualifiedName,
    };

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
