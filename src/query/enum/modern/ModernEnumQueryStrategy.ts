import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { EnumQueryStrategy } from '../EnumQueryStrategy';

export class ModernEnumQueryStrategy implements EnumQueryStrategy {
  public queryEnumConstantTables($object: CheerioAPI): Cheerio<Element> {
    return $object(
      '#enum-constant-detail > .member-list > li, .enum-constant-details > .member-list > li',
    );
  }
}
