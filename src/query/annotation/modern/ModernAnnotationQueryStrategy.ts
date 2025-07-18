import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import type { AnnotationQueryStrategy } from '../AnnotationQueryStrategy';

export class ModernAnnotationQueryStrategy implements AnnotationQueryStrategy {
  public queryElementTables($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '#method-detail > .member-list > li, .member-details > .member-list > li, .method-details > .member-list > li',
    );
  }

  public queryElementPrototypeText($element: Cheerio<Element>): string {
    return $element.find('section').attr('id') ?? '';
  }

  public queryElementSignature($element: Cheerio<Element>): Cheerio<Element> {
    return $element.find('.member-signature');
  }

  public queryElementModifiersText($signature: Cheerio<Element>): string {
    return $signature.find('.modifiers').text();
  }

  public queryElementNameText(
    _$element: Cheerio<Element>,
    $signature: Cheerio<Element>,
  ): string {
    return $signature.find('.element-name').text();
  }

  public queryElementDescription($element: Cheerio<Element>): Cheerio<Element> {
    return $element
      .find('.block:not(:has(.description-from-type-label))')
      .last();
  }

  public queryElementDeprecation(
    $element: Cheerio<Element>,
  ): DeprecationContent | null {
    const $deprecated = $element.find('.deprecation-block');
    if (!$deprecated || !$deprecated.length) return null;

    const label = $deprecated.find('.deprecated-label');
    const forRemoval = label.text().includes('for removal');

    const $comment = $deprecated.find('.deprecation-comment');
    const text = $comment.length ? $comment.text().trim() : null;
    const html = $comment.html()?.trim() ?? text ?? null;

    return {
      forRemoval,
      text,
      html,
    };
  }

  public queryElementReturnType($signature: Cheerio<Element>): string {
    return $signature.find('.return-type').text().trim();
  }
}
