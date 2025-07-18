import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../entities/deprecation/DeprecationContent';

export interface ObjectQueryStrategy {
  queryObjectDeprecation($object: CheerioAPI): DeprecationContent | null;
  queryObjectSignature($object: CheerioAPI): Cheerio<Element>;
  queryObjectDescription($object: CheerioAPI): Cheerio<Element>;
  queryExtensionsWithTypesHtml($object: CheerioAPI): string | null;
  queryImplementationsWithTypesHtml($object: CheerioAPI): string | null;
  queryTypeParametersHeader($object: CheerioAPI): Cheerio<Element>;
}
