import type { Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../entities/deprecation/DeprecationContent';
import { TextFormatter } from '../../text/TextFormatter';
import type { QueryStrategy } from '../QueryStrategy';

/** A {@link QueryStrategy} for legacy Javadocs. */
export class LegacyQueryStrategy implements QueryStrategy {
  /** Matches a non-breaking space character (Unicode \u00A0). */
  protected static readonly NoBreakSpaceRegex = /\xa0/;

  /** Matches the classes extended by a class declaration, capturing them as 'superClasses', stopping at 'implements' or end of line. */
  protected static readonly SuperClassesExtendsRegex =
    /extends\s+(?<superClasses>[^;]*?)(?=\s*(implements|$))/;

  /** Matches the content of the last set of parentheses in a string, including the parentheses. */
  protected static readonly LastParenthesisRegex = /.*(\(.*\))[^()]*$/;

  /** Matches the last space in a string. */
  protected static readonly LastSpaceRegex = /\s(?!.*\s)/;

  public queryRootTabs($root: CheerioAPI): Cheerio<Element> {
    return $root('.contentContainer > .overviewSummary .colFirst > a');
  }

  public queryPackageDescription($package: CheerioAPI): Cheerio<Element> {
    return $package('.header > .docSummary > .block');
  }

  public queryPackageSignatureText($package: CheerioAPI): string {
    return (
      $package('h1')
        .text()
        /** only legacy seems to use a no-break space */
        .replace(LegacyQueryStrategy.NoBreakSpaceRegex, ' ')
        .trim()
    );
  }

  /** related packages weren't a thing in legacy */
  public queryRelatedPackages(_$package: CheerioAPI): null {
    return null;
  }

  public queryPackageContents($package: CheerioAPI): Cheerio<Element> {
    return $package('.colFirst a');
  }

  public queryObjectSignature($object: CheerioAPI): Cheerio<Element> {
    return $object('.description > .blockList > .blockList > pre');
  }

  public queryObjectDescription($object: CheerioAPI): Cheerio<Element> {
    return $object('.description > .blockList > .blockList > .block');
  }

  public queryExtensionsWithTypesHtml($object: CheerioAPI): string | null {
    const extendsHtml = $object(
      '.description > .blockList > .blockList > pre',
    ).html();
    if (!extendsHtml || !extendsHtml.length) {
      return null;
    }

    const match =
      LegacyQueryStrategy.SuperClassesExtendsRegex.exec(extendsHtml);

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
    return $object(
      '.description > .blockList > .blockList dt:contains("Type Parameters:")',
    );
  }

  /**
   * Legacy Javadocs don't have classes for each method, instead they're in the format:
   * ```
   * <h3>Method Detail</h3>
   * <a name="<prototype>"></a>
   * <ul class="blockList">
   *   // actual table data
   * </ul>
   *   // ... and so on
   * ```
   * Here we try to work around this issue by manipulating the HTML, adding a div
   * that wraps each pair, and then selecting those divs.
   */
  public queryMethodTables($object: CheerioAPI): Cheerio<Element> {
    const h3Element = $object('h3').filter((_, el) => {
      const text = $object(el).text().trim();
      return text === 'Method Detail' || text === 'Element Detail';
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
    return $method.find('a').attr('name') ?? '';
  }

  public queryMethodSignature($method: Cheerio<Element>): Cheerio<Element> {
    return $method.find('li.blockList > pre');
  }

  public queryMethodModifiersText($signature: Cheerio<Element>): string {
    /** TODO: improve this query, for now we'll leverage the work to findModifiers() */
    return $signature.text().trim();
  }

  public queryMethodNameText($method: Cheerio<Element>): string {
    return $method.find('ul > li.blockList > h4').text();
  }

  public queryMethodDescription($method: Cheerio<Element>): Cheerio<Element> {
    return $method.find('ul > li.blockList > div.block').last();
  }

  public queryMethodParameters(
    $signature: Cheerio<Element>,
    sanitizedSignature: string,
  ): Cheerio<Element> | null {
    const result = sanitizedSignature.match(
      LegacyQueryStrategy.LastParenthesisRegex,
    );
    if (!result) {
      return null;
    }

    const parameters = result[1]
      .split(', ')
      .map((param) =>
        // TODO: fix hacky workaround
        param.replace(
          LegacyQueryStrategy.LastSpaceRegex,
          TextFormatter.NoBreakSpace,
        ),
      )
      .join(', ');
    return $signature.clone().text(parameters) ?? null;
  }

  public queryMethodReturnType($signature: Cheerio<Element>): string {
    return $signature
      .text()
      .split(TextFormatter.NoBreakSpaceRegex)[0]
      .split('\n')
      .at(-1) as string;
  }

  public queryMemberDeprecation(
    $member: Cheerio<Element>,
  ): DeprecationContent | null {
    const $deprecation = $member.find('div.block > i');
    if (!$deprecation || !$deprecation.length) {
      return null;
    }

    const text = $deprecation.text().trim() ?? null;

    return {
      text,
      html: $deprecation.html() ?? text,
      forRemoval: null,
    };
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
      forRemoval: null,
    };
  }

  public queryFieldDescription($field: Cheerio<Element>): Cheerio<Element> {
    return $field.find('ul > li.blockList > div.block').last();
  }

  public queryFieldId($field: Cheerio<Element>): string {
    return $field.find('a').attr('name') ?? '';
  }

  public queryFieldModifiersText($signature: Cheerio<Element>): string {
    /** TODO: improve this query, for now we'll leverage the work to findModifiers() */
    return $signature.text().trim();
  }

  public queryFieldSignature($field: Cheerio<Element>): Cheerio<Element> {
    return $field.find('li.blockList > pre');
  }

  /**
   * Legacy Javadocs don't have classes for each field, instead they're in the format:
   * ```
   * <h3>Field Detail</h3>
   * <a name="<prototype>"></a>
   * <ul class="blockList">
   *   // actual table data
   * </ul>
   *   // ... and so on
   * ```
   * Here we try to work around this issue by manipulating the HTML, adding a div
   * that wraps each pair, and then selecting those divs.
   */
  public queryFieldTables($object: CheerioAPI): Cheerio<Element> {
    const h3Element = $object('h3').filter((_, el) => {
      const text = $object(el).text().trim();
      return text === 'Field Detail' || text === 'Enum Constant Detail';
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

  public queryFieldType(
    _$signature: Cheerio<Element>,
    signatureText: string,
  ): string {
    return signatureText.split(' ').at(-2) as string;
  }
}
