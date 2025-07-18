import { Collection } from '@discordjs/collection';
import type { AnnotationElementData } from '../../entities/annotation/element/AnnotationElementData';
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
      EntityTypeEnum.Annotation,
    );
    delete (base as { partialExtends?: unknown[] }).partialExtends;
    delete (base as { partialImplements?: unknown[] }).partialImplements;

    const present = cache.partialAnnotations.get(base.qualifiedName);
    if (present) {
      return present;
    }

    const elements: Collection<string, AnnotationElementData> =
      new Collection();
    for (const method of base.methods.values()) {
      const data: AnnotationElementData = {
        entityType: EntityTypeEnum.AnnotationElement,
        id: method.name,
        name: method.name,
        description: method.description,
        signature: method.signature,
        url: method.url,
        returns: method.returns,
        modifiers: method.modifiers,
        deprecation: method.deprecation,
        annotations: method.annotations,
      };

      elements.set(data.id, data);
    }

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
