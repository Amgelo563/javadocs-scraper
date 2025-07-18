import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../entities/deprecation/DeprecationContent';

export interface MethodQueryStrategy {
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
  queryMethodDeprecation($method: Cheerio<Element>): DeprecationContent | null;
}
