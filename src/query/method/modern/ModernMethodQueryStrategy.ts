import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import { TextFormatter } from '../../../text/TextFormatter';
import type { MethodQueryStrategy } from '../MethodQueryStrategy';

export class ModernMethodQueryStrategy implements MethodQueryStrategy {
  public queryMethodTables($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '#method-detail > .member-list > li, .member-details > .member-list > li, .method-details > .member-list > li',
    );
  }

  public queryMethodPrototypeText($method: Cheerio<Element>): string {
    return $method.find('section').attr('id') ?? '';
  }

  public queryMethodSignature($method: Cheerio<Element>): Cheerio<Element> {
    return $method.find('.member-signature');
  }

  public queryMethodModifiersText($signature: Cheerio<Element>): string {
    return $signature.find('.modifiers').text();
  }

  public queryMethodNameText(
    _$method: Cheerio<Element>,
    $signature: Cheerio<Element>,
  ): string {
    return $signature.find('.element-name').text();
  }

  public queryMethodDescription($method: Cheerio<Element>): Cheerio<Element> {
    return $method
      .find('.block:not(:has(.description-from-type-label))')
      .last();
  }

  public queryMethodParameters($signature: Cheerio<Element>): Cheerio<Element> {
    return $signature.find('.parameters');
  }

  public queryMethodReturnType($signature: Cheerio<Element>): string {
    return TextFormatter.stripWhitespaceInline(
      $signature.find('.return-type').text(),
    );
  }

  public queryMethodDeprecation(
    $method: Cheerio<Element>,
  ): DeprecationContent | null {
    const $deprecated = $method.find('.deprecation-block');
    if (!$deprecated || !$deprecated.length) return null;

    const label = $deprecated.find('.deprecated-label');
    const forRemoval = label.text().includes('for removal');

    const $comment = $deprecated.find('.deprecation-comment');
    const text = $comment.text().trim() || null;
    const html = $comment.html()?.trim() ?? text;

    return {
      forRemoval,
      text,
      html,
    };
  }
}
