import type { Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import type { FieldQueryStrategy } from '../FieldQueryStrategy';

export class LegacyFieldQueryStrategy implements FieldQueryStrategy {
  /**
   * 8-12 Javadocs don't have classes for each field, instead they're in the format:
   * ```
   * <h3>Field Detail</h3>
   * <a name="<prototype>"></a>
   * <ul class="blockList">
   *   // actual table data
   * </ul>
   *   // ... and so on
   * ```
   * There we try to work around this issue by manipulating the HTML, adding a div
   * that wraps each pair, and then selecting those divs.
   */
  public queryFieldTables($object: CheerioAPI): Cheerio<Element> {
    // java 13-15
    const semiModernTitleElement = $object(
      'section.fieldDetails, section.field-details',
    );
    if (semiModernTitleElement.length) {
      return $object(
        'section.fieldDetails > ul.blockList > li.blockList > section.detail, .field-details > .member-list > li',
      );
    }

    // java 7-12
    const h3Element = $object('h3').filter((_, el) => {
      const text = $object(el).text().trim();
      return text === 'Field Detail';
    });

    const nextSiblings = h3Element.nextAll('a, ul');

    let currentRowHtml = "<div class='field-detail'>";
    let rowsHtml = '';

    nextSiblings.each((_i, el) => {
      const $el = $object(el);
      const outerHTML = $el.prop('outerHTML');
      currentRowHtml += outerHTML;

      if ($el.is('ul')) {
        currentRowHtml += '</div>';
        rowsHtml += currentRowHtml;
        currentRowHtml = "<div class='field-detail'>";
      }
    });

    const $allElements = load(rowsHtml, undefined, false);
    return $allElements('div.field-detail');
  }

  public queryFieldId($field: Cheerio<Element>): string {
    return (
      $field.find('a').attr('name')
      ?? $field.find('a').attr('id')
      ?? $field.find('section').attr('id')
      ?? ''
    );
  }

  public queryFieldSignature($field: Cheerio<Element>): Cheerio<Element> {
    return $field.find(
      'li.blockList > pre, div.memberSignature, div.member-signature',
    );
  }

  public queryFieldDescription($field: Cheerio<Element>): Cheerio<Element> {
    const blocks = $field.find('div.block');

    const filtered = blocks.filter((_, el) => {
      const $el = $field.find(el);
      const directSpans = $el.children('span.deprecatedLabel');
      const strong = $el.children('span.strong');
      return directSpans.length === 0 && strong.text().trim() !== 'Deprecated.';
    });

    return filtered.last();
  }

  public queryFieldModifiersText($signature: Cheerio<Element>): string {
    /** TODO: improve this query, for now we'll leverage the work to findModifiers() */
    return $signature.text().trim();
  }

  public queryFieldType(
    _$signature: Cheerio<Element>,
    signatureText: string,
  ): string {
    return signatureText.split(' ').at(-2) as string;
  }

  public queryFieldDeprecation(
    $field: Cheerio<Element>,
  ): DeprecationContent | null {
    // j7
    const deprecatedBlock = $field
      .find('div.block')
      .filter((_, el) => {
        const span = $field.find(el).find('span.strong').first();
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

    const $block = $field.find(
      'div.block > .deprecatedLabel, div.deprecationBlock, div.deprecation-block',
    );
    if (!$block || !$block.length) {
      return null;
    }

    const $comment = $field.find(
      'div.block > i, div.block > span.deprecationComment, div.deprecationBlock > div.deprecationComment, div.deprecation-block > div.deprecation-comment',
    );

    const text = $comment.text().trim() || null;
    const pre = $field.find('pre');
    const forRemoval = pre.text().includes('forRemoval=true');

    return {
      text,
      html: $comment.html() || text,
      forRemoval,
    };
  }
}
