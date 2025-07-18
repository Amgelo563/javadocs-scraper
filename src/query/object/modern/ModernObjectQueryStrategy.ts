import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import type { ObjectQueryStrategy } from '../ObjectQueryStrategy';

export class ModernObjectQueryStrategy implements ObjectQueryStrategy {
  /** Matches the classes extended by a class declaration, capturing them as 'superClasses', stopping at 'implements' or end of line. */
  public static readonly SuperClassesExtendsRegex =
    /extends\s+(?<superClasses>[^]*?)(?=\s*(implements|$))/;

  public queryObjectDeprecation(
    $object: CheerioAPI,
  ): DeprecationContent | null {
    const $deprecated = $object('#class-description > .deprecation-block');
    if (!$deprecated || !$deprecated.length) {
      return null;
    }

    const label = $deprecated.find('.deprecated-label');
    const forRemoval = label.text().includes('for removal');

    const $comment = $deprecated.find('.deprecation-comment');
    const text = $comment.text().trim() ?? null;

    return {
      forRemoval,
      html: $comment.html() ?? text ?? null,
      text,
    };
  }

  public queryObjectSignature($object: CheerioAPI): Cheerio<Element> {
    return $object('div .type-signature');
  }

  public queryObjectDescription($object: CheerioAPI): Cheerio<Element> {
    return $object('#class-description > .block, .description > .block');
  }

  public queryExtensionsWithTypesHtml($object: CheerioAPI): string | null {
    const extendsHtml = $object('.extends-implements').html();
    if (!extendsHtml || !extendsHtml.length) {
      return null;
    }

    const match =
      ModernObjectQueryStrategy.SuperClassesExtendsRegex.exec(extendsHtml);

    return match?.groups?.superClasses ?? null;
  }

  public queryImplementationsWithTypesHtml($object: CheerioAPI): string | null {
    const extendsHtml = $object('.extends-implements').html();
    if (!extendsHtml || !extendsHtml.length) {
      return null;
    }

    const parts = extendsHtml.split('implements');
    return parts[1] ?? null;
  }

  public queryTypeParametersHeader($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '#class-description > dl.notes > dt:contains("Type Parameters:"), section.description > dl.notes > dt:contains("Type Parameters:")',
    );
  }
}
