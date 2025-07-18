import { Collection } from '@discordjs/collection';
import type { CheerioAPI } from 'cheerio';
import type { ObjectTypeParameterData } from '../../entities/object/ObjectTypeParameterData';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategyBundle } from '../../query/bundle/QueryStrategyBundle';
import type { ObjectQueryStrategy } from '../../query/object/ObjectQueryStrategy';
import { TextFormatter } from '../../text/TextFormatter';
import type { FieldScraper } from '../field/FieldScraper';
import type { InheritanceScraper } from '../inheritance/InheritanceScraper';
import type { MethodScraper } from '../method/MethodScraper';

/** Scrapes shared properties among objects like name, description, etc. */
export class BaseObjectScraper {
  /** Matches type parameters in the form Foo<T> */
  public static readonly TypeParameterTextRegex = /<(?<parameters>[^<>]*)>$/;

  protected readonly fetcher: Fetcher;

  protected readonly methodScraper: MethodScraper;

  protected readonly fieldScraper: FieldScraper;

  protected readonly inheritanceScraper: InheritanceScraper;

  constructor(options: {
    fetcher: Fetcher;
    methodScraper: MethodScraper;
    fieldScraper: FieldScraper;
    inheritanceScraper: InheritanceScraper;
  }) {
    this.fetcher = options.fetcher;
    this.methodScraper = options.methodScraper;
    this.fieldScraper = options.fieldScraper;
    this.inheritanceScraper = options.inheritanceScraper;
  }

  public scrape(options: {
    $: CheerioAPI;
    fullUrl: string;
    packageData: PartialPackageData;
    strategyBundle: QueryStrategyBundle;
    omitMethods?: boolean;
  }) {
    const { $, fullUrl, packageData, strategyBundle } = options;
    const name = $('title').text().split(' ')[0];
    const qualifiedName = `${packageData.name}.${name}`;

    const $signature = strategyBundle.objectStrategy.queryObjectSignature($);
    const signature = TextFormatter.stripWhitespaceInline($signature.text());

    const $description =
      strategyBundle.objectStrategy.queryObjectDescription($);
    const description = $description.text();
    const descriptionHtml = $description.html() ?? description;
    const descriptionObject =
      description || descriptionHtml
        ? {
            html: descriptionHtml ?? null,
            text: description ?? null,
          }
        : null;

    const extensions = this.inheritanceScraper.scrapeExtensions(
      $,
      strategyBundle.objectStrategy,
    );
    const implementations = this.inheritanceScraper.scrapeImplementations(
      $,
      strategyBundle.objectStrategy,
    );
    const methods = options.omitMethods
      ? new Collection<string, never>()
      : this.methodScraper.scrape($, fullUrl, strategyBundle.methodStrategy);
    const $fieldTables = strategyBundle.fieldStrategy.queryFieldTables($);
    const fields = this.fieldScraper.scrape(
      $,
      $fieldTables,
      fullUrl,
      strategyBundle.fieldStrategy,
    );

    const typeParameters = this.extractTypeParameters(
      $,
      strategyBundle.objectStrategy,
    );
    const deprecation = strategyBundle.objectStrategy.queryObjectDeprecation($);

    return {
      name,
      qualifiedName,
      description: descriptionObject,
      signature,
      url: fullUrl,
      partialPackage: packageData,
      partialExtends: extensions,
      partialImplements: implementations,
      methods,
      fields,
      typeParameters,
      deprecation: deprecation,
    };
  }

  protected extractTypeParameters(
    $: CheerioAPI,
    objectStrategy: ObjectQueryStrategy,
  ): Collection<string, ObjectTypeParameterData> {
    const data: Collection<string, ObjectTypeParameterData> = new Collection();
    const [_type, ...parts] = $('.title').first().text().split(' ');
    const name = parts.join(' ');
    const match = BaseObjectScraper.TypeParameterTextRegex.exec(name);
    const parameters = match?.groups?.parameters;
    if (!parameters) {
      return data;
    }

    const typeParameters = parameters
      .split(',')
      .map((parameter) => parameter.trim().replace(/\u200B/, ''));
    for (const typeParameter of typeParameters) {
      const [name, extension] = typeParameter.split(' extends ');

      data.set(name, {
        id: name,
        name: name,
        entityType: EntityTypeEnum.ObjectTypeParameter,
        description: null,
        signature: typeParameter,
        extends: extension ? extension : null,
      });
    }

    objectStrategy
      .queryTypeParametersHeader($)
      .nextUntil('dt, dl')
      .each((_i, element) => {
        const $element = $(element);
        const name = $element.find('code').first().text();
        const $description = $element.contents().not('code').first();
        const description =
          $description.text()?.replace('- ', '')?.trim() ?? null;
        $description.text(description);

        const descriptionHtml = $description.html() ?? description;

        const typeParameter = data.get(name);
        if (!typeParameter) {
          console.warn(
            `Type parameter ${name} not found, but description is "${$description}", for ${$('title').text()}`,
          );
          return;
        }

        typeParameter.description =
          description || descriptionHtml
            ? {
                html: descriptionHtml,
                text: description,
              }
            : null;
      });

    return data;
  }
}
