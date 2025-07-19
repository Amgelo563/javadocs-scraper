import type { Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import { startsWithAccessModifier } from '../../../entities/access/AccessModifier';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import { TextFormatter } from '../../../text/TextFormatter';
import type { MethodQueryStrategy } from '../MethodQueryStrategy';

export class LegacyMethodQueryStrategy implements MethodQueryStrategy {
  /** Matches the content of the last set of parentheses in a string, including the parentheses. */
  protected static readonly LastParenthesisRegex = /.*(\(.*\))[^()]*$/;

  /** Matches the last space in a string. */
  protected static readonly LastSpaceRegex = /\s(?!.*\s)/;

  /**
   * 8-12 Javadocs don't have classes for each method, instead they're in the format:
   * ```
   * <h3>Method Detail</h3>
   * <a name="<prototype>"></a>
   * <ul class="blockList">
   *   // actual table data
   * </ul>
   *   // ... and so on
   * ```
   * There we try to work around this issue by manipulating the HTML, adding a div
   * that wraps each pair, and then selecting those divs.
   */
  public queryMethodTables($object: CheerioAPI): Cheerio<Element> {
    // java 13-15
    const semiModernTitleElement = $object(
      'section.methodDetails, section.method-details',
    );
    if (semiModernTitleElement.length) {
      return $object(
        'section.methodDetails > ul.blockList > li.blockList > section.detail, .method-details > .member-list > li',
      );
    }

    // java 8-12
    const h3Element = $object('h3').filter((_, el) => {
      const text = $object(el).text().trim();
      return text === 'Method Detail';
    });

    const nextSiblings = h3Element.nextAll('a, ul');
    let currentRowHtml = "<div class='method-detail'>";
    let rowsHtml = '';

    nextSiblings.each((_i, el) => {
      const $el = $object(el);
      const outerHTML = $el.prop('outerHTML');
      currentRowHtml += outerHTML;

      if ($el.is('ul')) {
        currentRowHtml += '</div>';
        rowsHtml += currentRowHtml;
        currentRowHtml = "<div class='method-detail'>";
      }
    });

    const $allElements = load(rowsHtml, undefined, false);
    return $allElements('div.method-detail');
  }

  public queryMethodPrototypeText($method: Cheerio<Element>): string {
    return (
      $method.find('a').attr('name')
      ?? $method.find('a').attr('id')
      ?? $method.find('section').attr('id')
      ?? ''
    );
  }

  public queryMethodSignature($method: Cheerio<Element>): Cheerio<Element> {
    return $method.find(
      'li.blockList > pre, div.memberSignature, div.member-signature',
    );
  }

  public queryMethodModifiersText($signature: Cheerio<Element>): string {
    /** TODO: improve this query, for now we'll leverage the work to findModifiers() */
    return $signature.text().trim();
  }

  public queryMethodNameText($method: Cheerio<Element>): string {
    return $method
      .find(
        'ul > li.blockList > h4, div.memberSignature > span.memberName, div.member-signature > span.member-name',
      )
      .text();
  }

  public queryMethodDescription($method: Cheerio<Element>): Cheerio<Element> {
    // java 8-12
    const legacy = $method.find('ul > li.blockList > div.block').last();
    // second is java 13+
    return legacy.length ? legacy : $method.find('div.block');
  }

  public queryMethodParameters(
    $signature: Cheerio<Element>,
    sanitizedSignature: string,
  ): Cheerio<Element> | null {
    const result = sanitizedSignature.match(
      LegacyMethodQueryStrategy.LastParenthesisRegex,
    );
    if (!result) {
      return null;
    }

    const parameters = result[1]
      .split(', ')
      .map((param) =>
        // TODO: fix hacky workaround
        param.replace(
          LegacyMethodQueryStrategy.LastSpaceRegex,
          TextFormatter.NoBreakSpace,
        ),
      )
      .join(', ');
    return $signature.clone().text(parameters) || null;
  }

  public queryMethodReturnType($signature: Cheerio<Element>): string {
    const parts = $signature.text().split(TextFormatter.NoBreakSpaceRegex);
    if (startsWithAccessModifier(parts[0])) {
      parts.shift();
    }
    const part = parts[0].startsWith('<') ? parts[1] : parts[0];

    return part.split('\n').at(-1) ?? '';
  }

  public queryMethodDeprecation(
    $method: Cheerio<Element>,
  ): DeprecationContent | null {
    const $deprecation = $method.find(
      '.block > span.deprecationComment, div.deprecationBlock > div.deprecationComment, div.deprecation-block > div.deprecation-comment',
    );
    if (!$deprecation || !$deprecation.length) {
      const hasLabel =
        $method.find('.deprecatedLabel, .deprecated-label').length > 0;
      if (!hasLabel) return null;
      return {
        text: null,
        html: null,
        forRemoval: false,
      };
    }

    const text = $deprecation.text().trim() || null;
    const pre = $method.find('pre');
    const forRemoval = pre.text().includes('forRemoval=true');

    return {
      text,
      html: $deprecation.html() ?? text,
      forRemoval,
    };
  }
}
