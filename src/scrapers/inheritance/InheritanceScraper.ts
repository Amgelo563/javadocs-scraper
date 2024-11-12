import type { Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import type { ExternalEntityData } from '../../entities/external/ExternalEntityData';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { QueryStrategy } from '../../query/QueryStrategy';

export class InheritanceScraper {
  public static readonly TypeParameterHtmlRegex = /&lt;.*&gt;/g;

  public scrapeExtensions(
    $: CheerioAPI,
    strategy: QueryStrategy,
  ): (string | ExternalEntityData)[] {
    const extensionsWithTypesHtml = strategy.queryExtensionsWithTypesHtml($);

    /** strip type parameters within extensions */
    const extendsElementsHtml = extensionsWithTypesHtml
      ?.replaceAll(InheritanceScraper.TypeParameterHtmlRegex, '')
      ?.trim();
    if (!extendsElementsHtml) {
      return [];
    }

    const $newExtends = load(extendsElementsHtml);

    const $extendsElements = $newExtends('a');
    return this.processExtensionsOrImplementations($, $extendsElements);
  }

  public scrapeImplementations(
    $: CheerioAPI,
    strategy: QueryStrategy,
  ): (string | ExternalEntityData)[] {
    const implementations: (string | ExternalEntityData)[] = [];
    const implementsWithTypesHtml =
      strategy.queryImplementationsWithTypesHtml($);

    const implementsElementsHtml = implementsWithTypesHtml
      ?.replaceAll(InheritanceScraper.TypeParameterHtmlRegex, '')
      ?.trim();

    if (!implementsElementsHtml) {
      return implementations;
    }

    const $newImplements = load(implementsElementsHtml);

    const $implementsElements = $newImplements('a');
    return this.processExtensionsOrImplementations($, $implementsElements);
  }

  protected processExtensionsOrImplementations(
    $: CheerioAPI,
    elements: Cheerio<Element>,
  ): (string | ExternalEntityData)[] {
    const extensions: (string | ExternalEntityData)[] = [];

    for (const extendsElement of elements) {
      const cheerioElement = $(extendsElement);
      const title = cheerioElement.attr('title');
      if (!title) {
        throw new Error(
          `Title for extends element ${extendsElement} not found`,
        );
      }
      const packageName = title.split(' in ').at(-1) as string;

      const name = cheerioElement.text();
      if (!name) {
        throw new Error(`Name for extends element ${extendsElement} not found`);
      }

      const url = cheerioElement.attr('href');
      if (!url) {
        throw new Error(`URL for extends element ${extendsElement} not found`);
      }

      /** External interface */
      if (url.startsWith('http')) {
        const qualifiedName = `${packageName}.${name}`;

        const externalData: ExternalEntityData = {
          entityType: EntityTypeEnum.ExternalObject,
          qualifiedName,
          name,
          url,
          id: qualifiedName,
          description: null,
          signature: name,
        };
        extensions.push(externalData);
        continue;
      }

      const qualifiedName = `${packageName}.${name}`;
      extensions.push(qualifiedName);
    }

    return extensions;
  }
}
