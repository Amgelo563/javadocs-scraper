import { Collection } from '@discordjs/collection';
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import { resolve } from 'url';
import { findAccessModifier } from '../../entities/access/AccessModifier';
import type { FieldData } from '../../entities/field/FieldData';
import type { Modifier } from '../../entities/modifier/Modifier';
import { findModifiers } from '../../entities/modifier/Modifier';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { FieldQueryStrategy } from '../../query/field/FieldQueryStrategy';
import { TextFormatter } from '../../text/TextFormatter';

/** Scrapes the {@link FieldData}s from an object wrapped in a {@link CheerioAPI}. */
export class FieldScraper {
  public scrape(
    $object: CheerioAPI,
    $tables: Cheerio<Element>,
    objectUrl: string,
    strategy: FieldQueryStrategy,
  ): Collection<string, FieldData<null>> {
    if (!$tables || $tables.length === 0) {
      return new Collection();
    }

    const data = new Collection<string, FieldData<null>>();
    for (const fieldTable of $tables) {
      const $field = $object(fieldTable);

      const fieldId = strategy.queryFieldId($field);
      if (!fieldId) {
        throw new Error(`Field reference not found for ${fieldTable}`);
      }
      const url = resolve(objectUrl, `#${fieldId}`);

      const $signature = strategy.queryFieldSignature($field);
      const signature = TextFormatter.stripWhitespaceInline($signature.text());

      const modifiersText = strategy.queryFieldModifiersText($signature);
      const modifiers: Modifier[] = findModifiers(modifiersText);
      const accessModifier = findAccessModifier(signature);

      const $description = strategy.queryFieldDescription($field);
      const description = $description.text().trim() || null;
      const descriptionHtml = $description.html()?.trim() || description;
      const descriptionObject =
        description || descriptionHtml
          ? {
              text: description,
              html: descriptionHtml,
            }
          : null;

      const fieldType = strategy.queryFieldType($signature, signature);
      const deprecation = strategy.queryFieldDeprecation($field);

      const field: FieldData<null> = {
        entityType: EntityTypeEnum.Field,
        name: fieldId,
        description: descriptionObject,
        signature,
        modifiers,
        type: fieldType,
        url,
        deprecation,
        accessModifier,
        id: fieldId,
        inheritedFrom: null,
      };

      data.set(fieldId, field);
    }

    return data;
  }
}
