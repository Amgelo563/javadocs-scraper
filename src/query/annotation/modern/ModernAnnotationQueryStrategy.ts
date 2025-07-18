import type { Cheerio } from 'cheerio';
import type { Element } from 'domhandler';
import type { AnnotationQueryStrategy } from '../AnnotationQueryStrategy';

export class ModernAnnotationQueryStrategy implements AnnotationQueryStrategy {
  public queryAnnotationElementReturnType(
    $signature: Cheerio<Element>,
  ): string {
    return $signature.find('.return-type').text().trim();
  }
}
