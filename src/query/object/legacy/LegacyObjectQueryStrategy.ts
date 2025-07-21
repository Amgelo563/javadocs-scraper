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
    return parts[1] || null;
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
    // j7
    const deprecatedBlock = $object(
      'div.description > ul.blockList > li.blockList > div.block',
    )
      .filter((_, el) => {
        const span = $object(el).find('strong').first();
        return span.length === 1 && span.text().trim() === 'Deprecated.';
      })
      .first();
    if (deprecatedBlock.length) {
      const $comment = deprecatedBlock.find('i');
      const text = $comment.text().trim() || null;
      const html = $comment.html() ?? text;
      return {
        text,
        html,
        forRemoval: false,
      };
    }

    const $comment = $object(
      '.description .deprecationComment, .description .deprecation-comment',
    );
    if (!$comment || !$comment.length) {
      return null;
    }

    const text = $comment.text().trim() || null;
    const forRemoval = $object('.description .deprecated-label')
      .text()
      .includes('for removal');

    return {
      text,
      html: $comment.html() ?? text,
      forRemoval,
    };
  }
}
