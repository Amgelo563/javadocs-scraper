import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { DeprecationContent } from '../../entities/deprecation/DeprecationContent';

export interface FieldQueryStrategy {
  queryFieldTables($object: CheerioAPI): Cheerio<Element>;
  queryFieldId($field: Cheerio<Element>): string;
  queryFieldSignature($field: Cheerio<Element>): Cheerio<Element>;
  queryFieldDescription($field: Cheerio<Element>): Cheerio<Element>;
  queryFieldModifiersText($signature: Cheerio<Element>): string;
  queryFieldType($signature: Cheerio<Element>, signatureText: string): string;
  queryFieldDeprecation($field: Cheerio<Element>): DeprecationContent | null;
}
