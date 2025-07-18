import { Collection } from '@discordjs/collection';
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import { resolve as urlResolve } from 'url';
import type { AnnotationElementData } from '../../entities/annotation/element/AnnotationElementData';
import type { MethodReturnData } from '../../entities/method/return/MethodReturnData';
import type { Modifier } from '../../entities/modifier/Modifier';
import { findModifiers } from '../../entities/modifier/Modifier';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { AnnotationQueryStrategy } from '../../query/annotation/AnnotationQueryStrategy';
import { TextFormatter } from '../../text/TextFormatter';

export class AnnotationElementScraper {
  public scrape(options: {
    $object: CheerioAPI;
    objectUrl: string;
    annotationStrategy: AnnotationQueryStrategy;
  }): Collection<string, AnnotationElementData> {
    const { $object, objectUrl, annotationStrategy } = options;

    const $elementTables = annotationStrategy.queryElementTables($object);
    if (!$elementTables || $elementTables.length === 0) {
      return new Collection();
    }

    const data = new Collection<string, AnnotationElementData>();
    for (const $methodTable of $elementTables) {
      const $element = $object($methodTable);

      const prototype = annotationStrategy.queryElementPrototypeText($element);
      if (!prototype) {
        throw new Error(`Element prototype not found for ${$element.text()}`);
      }
      const url = urlResolve(objectUrl, `#${prototype}`);

      const $signature = annotationStrategy.queryElementSignature($element);
      const signature = TextFormatter.stripWhitespaceInline($signature.text());

      const modifiersText =
        annotationStrategy.queryElementModifiersText($signature);
      const modifiers: Modifier[] = findModifiers(modifiersText);

      const name = annotationStrategy.queryElementNameText(
        $element,
        $signature,
      );
      const $description = annotationStrategy.queryElementDescription($element);
      const description = $description.text().trim() ?? null;
      const descriptionHtml = $description.html()?.trim() ?? description;

      const deprecation = annotationStrategy.queryElementDeprecation($element);
      const returns = this.extractReturns(
        $element,
        $signature,
        annotationStrategy,
      );

      const annotations = this.extractAnnotations(signature);

      const element: AnnotationElementData = {
        entityType: EntityTypeEnum.AnnotationElement,
        name,
        url,
        description: {
          text: description,
          html: descriptionHtml,
        },
        modifiers,
        signature,
        returns,
        annotations,
        id: name,
        deprecation,
      };

      data.set(name, element);
    }

    return data;
  }

  protected extractReturns(
    $element: Cheerio<Element>,
    $signature: Cheerio<Element>,
    annotationStrategy: AnnotationQueryStrategy,
  ): MethodReturnData {
    const returnType = annotationStrategy.queryElementReturnType($signature);

    const $description = $element
      .find('dt:contains("Returns:")')
      .nextUntil('dt');
    const description = $description.text()?.trim() ?? null;
    const descriptionHtml = $description.html()?.trim() ?? description ?? null;
    const descriptionObject =
      description || descriptionHtml
        ? {
            text: description,
            html: descriptionHtml,
          }
        : null;

    return {
      entityType: EntityTypeEnum.MethodReturn,
      type: returnType,
      description: descriptionObject,
    };
  }

  protected extractAnnotations(signature: string): string[] {
    const parts = signature.split(' ');
    const result: string[] = [];
    for (const part of parts) {
      if (part.startsWith('@')) {
        result.push(part);
      } else {
        break;
      }
    }
    return result;
  }
}
