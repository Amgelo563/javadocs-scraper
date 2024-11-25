import { Collection } from '@discordjs/collection';
import type { CheerioAPI } from 'cheerio';
import { resolve } from 'url';
import { findAccessModifier } from '../../entities/access/AccessModifier';
import type { FieldData } from '../../entities/field/FieldData';
import type { Modifier } from '../../entities/modifier/Modifier';
import { findModifiers } from '../../entities/modifier/Modifier';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { QueryStrategy } from '../../query/QueryStrategy';
import { TextFormatter } from '../../text/TextFormatter';

/** Scrapes the {@link FieldData}s from an object wrapped in a {@link CheerioAPI}. */
export class FieldScraper {
  public scrape(
    $object: CheerioAPI,
    objectUrl: string,
    strategy: QueryStrategy,
  ): Collection<string, FieldData<null>> {
    const fieldTables = strategy.queryFieldTables($object);
    if (!fieldTables || fieldTables.length === 0) {
      return new Collection();
    }

    const data = new Collection<string, FieldData<null>>();
    for (const fieldTable of fieldTables) {
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
      const descriptionHtml = $description.html()?.trim() ?? null;
      const description = $description.text().trim() ?? null;

      const fieldType = strategy.queryFieldType($signature, signature);
      const deprecation = strategy.queryMemberDeprecation($field);

      const field: FieldData<null> = {
        entityType: EntityTypeEnum.Field,
        name: fieldId,
        description: {
          text: description,
          html: descriptionHtml,
        },
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
