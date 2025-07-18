import type { Cheerio } from 'cheerio';
import type { Element } from 'domhandler';
import { TextFormatter } from '../../../text/TextFormatter';
import type { AnnotationQueryStrategy } from '../AnnotationQueryStrategy';

export class LegacyAnnotationQueryStrategy implements AnnotationQueryStrategy {
  public queryAnnotationElementReturnType(
    $signature: Cheerio<Element>,
  ): string {
    const part = $signature
      .text()
      .split(TextFormatter.NoBreakSpaceRegex)
      // ['public', 'abstract', '...', 'T', 'name']
      .at(-2);

    return part?.split('\n').at(-1) ?? '';
  }
}
