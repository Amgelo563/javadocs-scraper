import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../entities/deprecation/DeprecationContent';
import type { QueryStrategy } from '../QueryStrategy';

/** A {@link QueryStrategy} for modern Javadocs. */
export class ModernQueryStrategy implements QueryStrategy {
  public static readonly SuperClassesExtendsRegex =
    /extends\s+(?<superClasses>[^]*?)(?=\s*(implements|$))/;

  public queryRootTabs($root: CheerioAPI): Cheerio<Element> {
    return $root(
      '#all-packages-table > .summary-table > .col-first > a, #package-summary-table > .summary-table > .col-first > a',
    );
  }

  public queryPackageDescription($package: CheerioAPI): Cheerio<Element> {
    return $package('#package-description > .block');
  }

  public queryPackageSignatureText($package: CheerioAPI): string {
    return $package('div .package-signature').text();
  }

  public queryRelatedPackages($package: CheerioAPI): Cheerio<Element> {
    return $package(
      '#related-package-summary > .summary-table > .col-first:not(:first-child)',
    );
  }

  public queryPackageContents($package: CheerioAPI): Cheerio<Element> {
    return $package('.col-first:not(:first-child) a');
  }

  public queryObjectDeprecation(
    $object: CheerioAPI,
  ): DeprecationContent | null {
    const $deprecated = $object('#class-description > .deprecation-block');
    if (!$deprecated || !$deprecated.length) return null;

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
    return $object('#class-description > .block');
  }

  public queryExtensionsWithTypesHtml($object: CheerioAPI): string | null {
    const extendsHtml = $object('.extends-implements').html();
    if (!extendsHtml || !extendsHtml.length) {
      return null;
    }

    const match =
      ModernQueryStrategy.SuperClassesExtendsRegex.exec(extendsHtml);

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
      '#class-description > .notes > dt:contains("Type Parameters:")',
    );
  }

  public queryMethodTables($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '#method-detail > .member-list > li, .member-details > .member-list > li',
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
    return $signature.find('.return-type').text().trim();
  }

  public queryAnnotationElementReturnType($element: Cheerio<Element>): string {
    return this.queryMethodReturnType($element);
  }

  public queryMemberDeprecation(
    $member: Cheerio<Element>,
  ): DeprecationContent | null {
    const $deprecated = $member.find('.deprecation-block');
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

  public queryFieldDescription($field: Cheerio<Element>): Cheerio<Element> {
    return $field.find('.block:not(:has(.description-from-type-label))').last();
  }

  public queryFieldId($field: Cheerio<Element>): string {
    return $field.find('section').attr('id') ?? '';
  }

  public queryFieldModifiersText($signature: Cheerio<Element>): string {
    return $signature.find('.modifiers').text();
  }

  public queryFieldSignature($field: Cheerio<Element>): Cheerio<Element> {
    return $field.find('.member-signature');
  }

  public queryFieldTables($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '#field-detail > .member-list > li, #enum-constant-detail > .member-list > li',
    );
  }

  public queryFieldType($signature: Cheerio<Element>): string {
    return $signature.find('.return-type').text().trim();
  }
}
