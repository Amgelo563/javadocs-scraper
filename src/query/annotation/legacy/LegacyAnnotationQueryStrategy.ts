import type { Cheerio, CheerioAPI } from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import type { DeprecationContent } from '../../../entities/deprecation/DeprecationContent';
import { TextFormatter } from '../../../text/TextFormatter';
import type { AnnotationQueryStrategy } from '../AnnotationQueryStrategy';

export class LegacyAnnotationQueryStrategy implements AnnotationQueryStrategy {
  public queryElementTables($object: CheerioAPI): Cheerio<Element> {
    const blocks: Cheerio<AnyNode>[] = [];

    $object('a[name$="--"], a[id$="()"], section[id$="()"]').each(
      (_, anchor) => {
        const $anchor = $object(anchor);
        let $ul = $anchor.next('ul');
        if (!$ul || !$ul.length) {
          const parent = anchor.parent?.parent;
          if (!parent || parent.type !== 'tag') {
            throw new Error(
              `Expected <ul> after <a> but found ${parent ?? 'null'}`,
            );
          }

          $ul = $object(parent);
        }

        const wrapper = $object('<div></div>');
        wrapper.append($anchor.clone(), $ul.clone());

        blocks.push(wrapper);
      },
    );

    const merged: AnyNode[] = [];
    for (const cheerioArray of blocks) {
      cheerioArray.each((_, el) => {
        merged.push(el);
      });
    }

    return $object(merged) as Cheerio<Element>;
  }

  public queryElementPrototypeText($element: Cheerio<Element>): string {
    const text =
      $element.find('a').attr('name')
      ?? $element.find('a').attr('id')
      ?? $element.find('section').attr('id')
      ?? '';
    return text.replace('-', '(').replace('-', ')');
  }

  public queryElementSignature($element: Cheerio<Element>): Cheerio<Element> {
    return $element.find(
      'li.blockList > pre, div.memberSignature, div.member-signature',
    );
  }

  public queryElementModifiersText($signature: Cheerio<Element>): string {
    /** TODO: improve this query, for now we'll leverage the work to findModifiers() */
    return $signature.text().trim();
  }

  public queryElementNameText($element: Cheerio<Element>): string {
    return $element
      .find(
        'ul > li.blockList > h4, div.memberSignature > span.memberName, div.member-signature > span.member-name',
      )
      .first()
      .text();
  }

  public queryElementDescription($element: Cheerio<Element>): Cheerio<Element> {
    // java 8-12
    const legacy = $element.find('ul > li.blockList > div.block').last();
    // second is java 13+
    return legacy.length ? legacy : $element.find('div.block');
  }

  public queryElementDeprecation(
    $element: Cheerio<Element>,
  ): DeprecationContent | null {
    const $deprecation = $element.find(
      'div.block > i, .block > span.deprecationComment, div.deprecationBlock > div.deprecationComment, div.deprecation-block > div.deprecation-comment',
    );
    if (!$deprecation || !$deprecation.length) {
      const hasLabel =
        $element.find('.deprecatedLabel, .deprecated-label').length > 0;
      if (!hasLabel) return null;
      return {
        text: null,
        html: null,
        forRemoval: false,
      };
    }

    const text = $deprecation.text().trim() || null;
    const pre = $element.find('pre');
    const forRemoval = pre.text().includes('forRemoval=true');

    return {
      text,
      html: $deprecation.html() ?? text,
      forRemoval,
    };
  }

  public queryElementReturnType($signature: Cheerio<Element>): string {
    const part = $signature
      .text()
      .split(TextFormatter.NoBreakSpaceRegex)
      // ['public', 'abstract', '...', 'T', 'name']
      .at(-2);

    return part?.split('\n').at(-1) ?? '';
  }
}
