import { Collection } from '@discordjs/collection';
import type { Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import { resolve as urlResolve } from 'url';
import {
  findAccessModifier,
  isAccessModifier,
} from '../../entities/access/AccessModifier';
import type { MethodData } from '../../entities/method/MethodData';
import type { MethodReturnData } from '../../entities/method/return/MethodReturnData';
import type { MethodTypeParameterData } from '../../entities/method/type/MethodTypeParameterData';
import type { Modifier } from '../../entities/modifier/Modifier';
import { findModifiers } from '../../entities/modifier/Modifier';
import type { ParameterData } from '../../entities/parameter/ParameterData';
import { EntityTypeEnum } from '../../entities/type/EntityType';
import type { MethodQueryStrategy } from '../../query/method/MethodQueryStrategy';
import { TextFormatter } from '../../text/TextFormatter';

/** Scrapes the {@link MethodData}s from an object wrapped in a {@link CheerioAPI}. */
export class MethodScraper {
  protected static readonly TextTypeParameter =
    /<(?<match>[^<>]*(?:<[^<>]*>[^<>]*)*)>/;

  public scrape(
    $object: CheerioAPI,
    objectUrl: string,
    methodStrategy: MethodQueryStrategy,
  ): Collection<string, MethodData<null>> {
    const $methodTables = methodStrategy.queryMethodTables($object);
    if (!$methodTables || $methodTables.length === 0) {
      return new Collection();
    }

    const data = new Collection<string, MethodData<null>>();
    for (const $methodTable of $methodTables) {
      const $method = $object($methodTable);

      const prototype = methodStrategy.queryMethodPrototypeText($method);
      if (!prototype) {
        throw new Error(`Method prototype not found for ${$method.text()}`);
      }
      const url = urlResolve(objectUrl, `#${prototype}`);

      // thanks to legacy, where the prototype is in the form of `name-parameterA-parameterB-` instead of `name(parameterA, parameterB)`
      // replace the first dash with (, replace all other dashes with commas, remove the last character (a dash) and add )
      const patchedPrototype = `${prototype
        .replace('-', '(')
        .replaceAll('-', ',')
        .substring(0, prototype.length - 1)})`;

      const $signature = methodStrategy.queryMethodSignature($method);
      const signature = TextFormatter.stripWhitespaceInline($signature.text());

      const modifiersText = methodStrategy.queryMethodModifiersText($signature);
      const modifiers: Modifier[] = findModifiers(modifiersText);

      const name = methodStrategy.queryMethodNameText($method, $signature);
      const $description = methodStrategy.queryMethodDescription($method);
      const description = $description.text().trim() || null;
      const descriptionHtml = $description.html()?.trim() || description;
      const descriptionObject =
        description || descriptionHtml
          ? {
              text: description,
              html: descriptionHtml,
            }
          : null;

      const parameters = this.extractParameters(
        $object,
        $method,
        $signature,
        signature,
        methodStrategy,
      );
      const deprecation = methodStrategy.queryMethodDeprecation($method);
      const returns = this.extractReturns($method, $signature, methodStrategy);

      const annotations = this.extractAnnotations(signature);
      const typeParameters = this.extractTypeParameters($method, signature);
      const accessModifier = findAccessModifier(signature);

      const method: MethodData<null> = {
        entityType: EntityTypeEnum.Method,
        name,
        url,
        description: descriptionObject,
        modifiers,
        parameters,
        signature,
        returns,
        annotations,
        typeParameters,
        accessModifier,
        id: patchedPrototype,
        inheritedFrom: null,
        prototype: patchedPrototype,
        deprecation,
      };

      data.set(patchedPrototype, method);
    }

    return data;
  }

  protected extractParameters(
    $object: CheerioAPI,
    $method: Cheerio<Element>,
    $signature: Cheerio<Element>,
    sanitizedSignature: string,
    methodStrategy: MethodQueryStrategy,
  ): Collection<string, ParameterData> {
    const $parameters = methodStrategy.queryMethodParameters(
      $signature,
      sanitizedSignature,
    );
    const datas = new Collection<string, ParameterData>();
    if (!$parameters || !$parameters.length) {
      return datas;
    }

    $parameters.each((_i, element) => {
      const parameter = $object(element).html();
      if (!parameter) {
        return false;
      }

      const trimmedParameter = parameter.substring(1, parameter.length - 1);
      if (!trimmedParameter) {
        return false;
      }

      const parametersHtml = trimmedParameter
        .replaceAll('\n', '')
        .split(', ')
        .map((part) => part.trim());

      for (const parameterHtml of parametersHtml) {
        const text = load(parameterHtml).text();
        const [typeWithAnnotations, name] = text.split(
          TextFormatter.NoBreakSpace,
        );
        const annotations: string[] = [];

        const parts = typeWithAnnotations.split(' ');
        /** if the part starts with @, push to annotation. otherwise break and use as type */
        for (const part of [...parts]) {
          if (part.startsWith('@')) {
            parts.splice(0, 1);
            annotations.push(part);
          } else {
            break;
          }
        }
        const type = parts.join(' ').trim();
        const signature = load(parameterHtml)
          .text()
          .trim()
          .replaceAll(/\s+/g, ' ');

        const parameter: ParameterData = {
          name,
          type,
          annotations,
          entityType: EntityTypeEnum.Parameter,
          description: null,
          id: name,
          signature,
        };
        datas.set(name, parameter);
      }
    });

    $method
      .find('dt:contains("Parameters:")')
      .filter((_i, element) => $object(element).text().trim() === 'Parameters:')
      .nextUntil('dt')
      .each((_i, element) => {
        const $element = $method.find(element);
        const { name, descriptionHtml, description } =
          this.extractNameAndDescription($element);

        const parameter = datas.get(name);
        if (!parameter) {
          console.warn(
            `Parameter ${name} not found, but description is "${description}", for ${$method.text()}`,
          );
          return;
        }
        parameter.description =
          descriptionHtml || description
            ? {
                text: description,
                html: descriptionHtml,
              }
            : null;
      });

    return datas;
  }

  protected extractReturns(
    $method: Cheerio<Element>,
    $signature: Cheerio<Element>,
    methodStrategy: MethodQueryStrategy,
  ): MethodReturnData {
    const returnType = methodStrategy.queryMethodReturnType($signature);

    const $description = $method
      .find('dt:contains("Returns:")')
      .nextUntil('dt');
    const description = $description.text()?.trim() || null;
    const descriptionHtml = $description.html()?.trim() || description;
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

  protected extractTypeParameters(
    $method: Cheerio<Element>,
    signature: string,
  ): Collection<string, MethodTypeParameterData> {
    const data = new Collection<string, MethodTypeParameterData>();
    const parts = signature.split(' ', 2);
    if (isAccessModifier(parts[0])) {
      parts.shift();
    }

    if (!parts[0] || !parts[0].startsWith('<')) {
      return data;
    }

    const result = signature.match(MethodScraper.TextTypeParameter);
    const match = result?.groups?.match;
    if (!match) {
      return data;
    }

    const parameters = TextFormatter.stripWhitespaceInline(match).split(',');
    for (const parameter of parameters) {
      const [name, extension] = parameter
        .split(' extends ')
        .map((part) => part.trim());

      const typeParameter: MethodTypeParameterData = {
        entityType: EntityTypeEnum.MethodTypeParameter,
        signature: parameter,
        name,
        extends: extension ?? null,
        description: null,
        id: name,
      };

      data.set(name, typeParameter);
    }

    $method
      .find('dt:contains("Type Parameters:")')
      .nextUntil('dt')
      .each((_i, element) => {
        const $element = $method.find(element);
        const { name, descriptionHtml, description } =
          this.extractNameAndDescription($element);

        const typeParameter = data.get(name);
        if (!typeParameter) {
          console.warn(
            `Method type parameter ${name} not found, but description is "${description}", for ${$method.text()}`,
          );
          return;
        }

        typeParameter.description =
          descriptionHtml || description
            ? {
                text: description,
                html: descriptionHtml,
              }
            : null;
      });

    return data;
  }

  protected extractNameAndDescription($element: Cheerio<Element>): {
    name: string;
    descriptionHtml: string | null;
    description: string | null;
  } {
    const name = $element.find('code').first().text();
    const $description = $element.contents().not('code').first();
    const description = $description.text()?.replace('- ', '')?.trim() || null;
    const descriptionHtml =
      $description.html()?.replace('- ', '')?.trim() || description;
    return { name, descriptionHtml, description };
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
