import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import type { ObjectQueryStrategy } from '../ObjectQueryStrategy';

export class LegacyObjectQueryStrategy implements ObjectQueryStrategy {
  /** Matches the classes extended by a class declaration, capturing them as 'superClasses', stopping at 'implements' or end of line. */
  protected static readonly SuperClassesExtendsRegex =
    /extends\s+(?<superClasses>[^;]*?)(?=\s*(implements|$))/;

  public queryObjectSignature($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '.description > .blockList > .blockList > pre, .description > pre',
    );
  }

  public queryObjectDescription($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '.description > .blockList > .blockList > .block, .description > .block',
    ).last();
  }

  public queryExtensionsWithTypesHtml($object: CheerioAPI): string | null {
    const extendsHtml = $object(
      '.description > .blockList > .blockList > pre, .description > pre',
    ).html();
    if (!extendsHtml || !extendsHtml.length) {
      return null;
    }

    const match =
      LegacyObjectQueryStrategy.SuperClassesExtendsRegex.exec(extendsHtml);

    return match?.groups?.superClasses ?? null;
  }

  public queryImplementationsWithTypesHtml($object: CheerioAPI): string | null {
    const extendsHtml = $object(
      '.description > .blockList > .blockList > pre',
    ).html();
    if (!extendsHtml || !extendsHtml.length) {
      return null;
    }

    const parts = extendsHtml.split('implements');
    return parts[1] ?? null;
  }

  public queryTypeParametersHeader($object: CheerioAPI): Cheerio<Element> {
    const legacy = $object(
      '.description > .blockList > .blockList dt:contains("Type Parameters:")',
    );
    if (legacy.length) {
      return legacy;
    }

    // java 13-15
    return $object('section.description > dl dt:contains("Type Parameters:")');
  }

  public queryObjectDeprecation(
    $object: CheerioAPI,
  ): DeprecationContent | null {
    const $div = $object(
      'div.description div.block > strong:contains("Deprecated")',
    ).parent();
    if (!$div || !$div.length) {
      return null;
    }

    const $deprecation = $div.find('div.block > i');
    const text = $deprecation.text().trim() ?? null;

    return {
      text,
      html: $deprecation.html() ?? text,
      forRemoval: false,
    };
  }
}
