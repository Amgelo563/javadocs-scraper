import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../entities/deprecation/DeprecationContent';

/** A strategy selected in runtime to query a Javadoc for a given version. */
export interface QueryStrategy {
  queryRootTabs($root: CheerioAPI): Cheerio<Element>;
  queryPackageSignatureText($package: CheerioAPI): string;
  queryPackageDescription($package: CheerioAPI): Cheerio<Element>;
  queryRelatedPackages($package: CheerioAPI): Cheerio<Element> | null;
  queryPackageContents($package: CheerioAPI): Cheerio<Element>;

  queryObjectDeprecation($object: CheerioAPI): DeprecationContent | null;
  queryObjectSignature($object: CheerioAPI): Cheerio<Element>;
  queryObjectDescription($object: CheerioAPI): Cheerio<Element>;
  queryExtensionsWithTypesHtml($object: CheerioAPI): string | null;
  queryImplementationsWithTypesHtml($object: CheerioAPI): string | null;
  queryTypeParametersHeader($object: CheerioAPI): Cheerio<Element>;

  queryMethodTables($object: CheerioAPI): Cheerio<Element>;
  queryMethodPrototypeText($method: Cheerio<Element>): string;
  queryMethodSignature($method: Cheerio<Element>): Cheerio<Element>;
  queryMethodModifiersText($signature: Cheerio<Element>): string;
  queryMethodNameText(
    $method: Cheerio<Element>,
    $signature: Cheerio<Element>,
  ): string;
  queryMethodDescription($method: Cheerio<Element>): Cheerio<Element>;
  queryMethodParameters(
    $signature: Cheerio<Element>,
    sanitizedSignature: string,
  ): Cheerio<Element> | null;
  queryMethodReturnType($signature: Cheerio<Element>): string;
  queryMemberDeprecation($member: Cheerio<Element>): DeprecationContent | null;

  queryAnnotationElementReturnType($element: Cheerio<Element>): string;

  queryFieldTables($object: CheerioAPI): Cheerio<Element>;
  queryFieldId($field: Cheerio<Element>): string;
  queryFieldSignature($field: Cheerio<Element>): Cheerio<Element>;
  queryFieldDescription($field: Cheerio<Element>): Cheerio<Element>;
  queryFieldModifiersText($signature: Cheerio<Element>): string;
  queryFieldType($signature: Cheerio<Element>, signatureText: string): string;

  queryEnumConstantTables($object: CheerioAPI): Cheerio<Element>;
}
