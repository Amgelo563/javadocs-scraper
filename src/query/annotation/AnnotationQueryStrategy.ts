import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../entities/deprecation/DeprecationContent';

export interface AnnotationQueryStrategy {
  queryElementTables($object: CheerioAPI): Cheerio<Element>;
  queryElementPrototypeText($element: Cheerio<Element>): string;
  queryElementSignature($element: Cheerio<Element>): Cheerio<Element>;
  queryElementModifiersText($element: Cheerio<Element>): string;
  queryElementNameText(
    $element: Cheerio<Element>,
    $signature: Cheerio<Element>,
  ): string;
  queryElementDescription($element: Cheerio<Element>): Cheerio<Element>;
  queryElementDeprecation(
    $element: Cheerio<Element>,
  ): DeprecationContent | null;
  queryElementReturnType($signature: Cheerio<Element>): string;
}
