import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import type { FieldQueryStrategy } from '../FieldQueryStrategy';

export class ModernFieldQueryStrategy implements FieldQueryStrategy {
  public queryFieldTables($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '#field-detail > .member-list > li, .field-details > .member-list > li',
    );
  }

  public queryFieldId($field: Cheerio<Element>): string {
    return $field.find('section').attr('id') ?? '';
  }

  public queryFieldSignature($field: Cheerio<Element>): Cheerio<Element> {
    return $field.find('.member-signature');
  }

  public queryFieldDescription($field: Cheerio<Element>): Cheerio<Element> {
    return $field.find('.block:not(:has(.description-from-type-label))').last();
  }

  public queryFieldModifiersText($signature: Cheerio<Element>): string {
    return $signature.find('.modifiers').text();
  }

  public queryFieldType($signature: Cheerio<Element>): string {
    return $signature.find('.return-type').text().trim();
  }

  public queryFieldDeprecation(
    $field: Cheerio<Element>,
  ): DeprecationContent | null {
    const $deprecated = $field.find('.deprecation-block');
    if (!$deprecated || !$deprecated.length) return null;

    const label = $deprecated.find('.deprecated-label');
    const forRemoval = label.text().includes('for removal');

    const $comment = $deprecated.find('.deprecation-comment');
    const text = $comment.text().trim() ?? null;

    return {
      forRemoval,
      text,
      html: $comment.html() ?? text,
    };
  }
}
