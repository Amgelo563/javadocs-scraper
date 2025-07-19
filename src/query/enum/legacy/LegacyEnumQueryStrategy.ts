import type { Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import type { EnumQueryStrategy } from '../EnumQueryStrategy';

export class LegacyEnumQueryStrategy implements EnumQueryStrategy {
  /**
   * Legacy Javadocs don't have classes for each enum constant, instead they're in the format:
   * ```
   * <h3>Enum Constant Detail</h3>
   * <a name="<prototype>"></a>
   * <ul class="blockList">
   *   // actual table data
   * </ul>
   *   // ... and so on
   * ```
   * Here we try to work around this issue by manipulating the HTML, adding a div
   * that wraps each pair, and then selecting those divs.
   */
  public queryEnumConstantTables($object: CheerioAPI): Cheerio<Element> {
    // java 13-15
    const semiModernTitleElement = $object(
      'section.constantDetails, section.constant-details',
    );
    if (semiModernTitleElement.length) {
      return $object(
        'section.constantDetails > ul.blockList > li.blockList > section.detail, .constant-details > .member-list > li',
      );
    }

    const h3Element = $object('h3').filter((_, el) => {
      const text = $object(el).text().trim();
      return text === 'Enum Constant Detail';
    });

    const nextSiblings = h3Element.nextAll('a, ul');

    let currentRowHtml = "<div class='enum-constant-detail'>";
    let rowsHtml = '';

    nextSiblings.each((_i, el) => {
      const $el = $object(el);
      const outerHTML = $el.prop('outerHTML');
      currentRowHtml += outerHTML;

      if ($el.is('ul')) {
        currentRowHtml += '</div>';
        rowsHtml += currentRowHtml;
        currentRowHtml = "<div class='enum-constant-detail'>";
      }
    });

    const $allElements = load(rowsHtml, undefined, false);
    return $allElements('div.enum-constant-detail');
  }
}
