import type { Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import { isAccessModifier } from '../../../entities/access/AccessModifier';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import { isModifier } from '../../../entities/modifier/Modifier';
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

    // java 7-12
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
      $method.find('a').attr('name')?.replaceAll(' ', '')
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
    const blocks = $method.find('div.block');

    const filtered = blocks.filter((_, el) => {
      const $el = $method.find(el);
      const directSpans = $el.children('span.deprecatedLabel');
      const strong = $el.children('span.strong');
      return directSpans.length === 0 && strong.text().trim() !== 'Deprecated.';
    });

    return filtered.last();
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
    const text = TextFormatter.stripWhitespaceInline($signature.text());
    const parts = this.splitBySpacesOrAngleGroups(text);

    while (true) {
      if (parts[0].startsWith('<')) {
        parts.shift();
        break;
      }
      if (
        isAccessModifier(parts[0])
        || isModifier(parts[0])
        || parts[0].startsWith('@')
      ) {
        parts.shift();
      } else {
        break;
      }
    }

    return parts[0];
  }

  public queryMethodDeprecation(
    $method: Cheerio<Element>,
  ): DeprecationContent | null {
    // j7
    const deprecatedBlock = $method
      .find('div.block')
      .filter((_, el) => {
        const span = $method.find(el).find('span.strong').first();
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

    const $label = $method.find('.deprecatedLabel, .deprecated-label');
    if (!$label.length) return null;

    const forRemoval = $label.text().includes('for removal');
    const $comment = $method.find(
      '.block > span.deprecationComment, div.deprecationBlock > div.deprecationComment, div.deprecation-block > div.deprecation-comment',
    );
    if (!$comment || !$comment.length) {
      return {
        text: null,
        html: null,
        forRemoval,
      };
    }

    const text = $comment.text().trim() || null;

    return {
      text,
      html: $comment.html() ?? text,
      forRemoval,
    };
  }

  /**
   * Splits a string by spaces, except when the section is wrapped in `<>`.
   * Supports nested angle brackets (eg `<a<b>>` is treated as a single token)
   */
  protected splitBySpacesOrAngleGroups(input: string): string[] {
    const tokens = [];
    let buffer = '';
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (char === '<') {
        depth++;
        buffer += char;
      } else if (char === '>') {
        depth = Math.max(depth - 1, 0); // avoid negative depth
        buffer += char;
      } else if (char === ' ' && depth === 0) {
        if (buffer.length > 0) {
          tokens.push(buffer);
          buffer = '';
        }
      } else {
        buffer += char;
      }
    }

    if (buffer.length > 0) {
      tokens.push(buffer);
    }

    return tokens;
  }
}
