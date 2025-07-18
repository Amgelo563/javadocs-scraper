import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';

export interface EnumQueryStrategy {
  queryEnumConstantTables($object: CheerioAPI): Cheerio<Element>;
}
