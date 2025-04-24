import { Collection } from '@discordjs/collection';
import type { CheerioAPI } from 'cheerio';
import type { ObjectTypeParameterData } from '../../entities/object/ObjectTypeParameterData';
import type { EntityType } from '../../entities/type/EntityType';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { Fetcher } from '../../fetch/Fetcher';
import type { PartialPackageData } from '../../partials/package/PartialPackageData';
import type { QueryStrategy } from '../../query/QueryStrategy';
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

  public scrape(
    $: CheerioAPI,
    fullUrl: string,
    packageData: PartialPackageData,
    strategy: QueryStrategy,
    expectedType: EntityType,
  ) {
    const name = $('title').text().split(' ')[0];
    const qualifiedName = `${packageData.name}.${name}`;

    const $signature = strategy.queryObjectSignature($);
    const signature = $signature.text().replaceAll('\n', ' ');

    const $description = strategy.queryObjectDescription($);
    const descriptionHtml = $description.html();
    const description = $description.text();

    const extensions = this.inheritanceScraper.scrapeExtensions($, strategy);
    const implementations = this.inheritanceScraper.scrapeImplementations(
      $,
      strategy,
    );
    const methods = this.methodScraper.scrape(
      $,
      fullUrl,
      strategy,
      expectedType,
    );
    const fields = this.fieldScraper.scrape($, fullUrl, strategy);
    const typeParameters = this.extractTypeParameters($, strategy);
    const deprecation = strategy.queryObjectDeprecation($);

    return {
      name,
      qualifiedName,
      description: {
        text: description,
        html: descriptionHtml,
      },
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
    strategy: QueryStrategy,
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
    strategy
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

        typeParameter.description = {
          text: description,
          html: descriptionHtml,
        };
      });

    return data;
  }
}
