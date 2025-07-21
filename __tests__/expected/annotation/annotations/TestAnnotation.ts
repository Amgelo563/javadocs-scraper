import { Collection } from '@discordjs/collection';
import type {
  AnnotationData,
  AnnotationElementData,
  PackageData,
} from '../../../../src';
import {
  ElementTypeEnum,
  EntityTypeEnum,
  ModifierEnum,
  RetentionPolicyEnum,
} from '../../../../src';

import { StringNames } from '../../../constants/StringNames';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import { generateMemberUrl } from '../../general/member/MemberValuesFactory';
import {
  generateObjectQualifiedName,
  generateObjectUrl,
} from '../../general/object/ObjectValuesFactory';

function generateElements(
  baseUrl: string,
  version: FixtureJavaVersion,
): Collection<string, AnnotationElementData> {
  const stringName = StringNames[version];
  const modifiers = version <= 8 ? [ModifierEnum.Abstract] : [];
  const legacySignaturePrefix = version <= 8 ? 'public abstract ' : '';

  const elements = new Collection<string, AnnotationElementData>();

  const nameElement: AnnotationElementData = {
    entityType: EntityTypeEnum.AnnotationElement,
    id: 'name',
    name: 'name',
    description: { text: 'A required element.', html: 'A required element.' },
    signature: `${legacySignaturePrefix}${stringName} name`,
    url: generateMemberUrl(baseUrl, 'name'),
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: stringName,
      description: { text: 'the name', html: 'the name' },
    },
    modifiers,
    deprecation: { forRemoval: false, text: null, html: null },
    annotations: [],
  };
  elements.set(nameElement.id, nameElement);

  const countElement: AnnotationElementData = {
    entityType: EntityTypeEnum.AnnotationElement,
    id: 'count',
    name: 'count',
    description: {
      text: 'An optional count with a default value.',
      html: 'An optional count with a default value.',
    },
    signature: `${legacySignaturePrefix}int count`,
    url: generateMemberUrl(baseUrl, 'count'),
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'int',
      description: { text: 'the count value', html: 'the count value' },
    },
    modifiers,
    deprecation: { forRemoval: false, text: null, html: null },
    annotations: [],
  };
  elements.set(countElement.id, countElement);

  const tagsElement: AnnotationElementData = {
    entityType: EntityTypeEnum.AnnotationElement,
    id: 'tags',
    name: 'tags',
    description: {
      text: 'An array of tags.',
      html: 'An array of tags.',
    },
    signature: `${legacySignaturePrefix}${stringName}[] tags`,
    url: generateMemberUrl(baseUrl, 'tags'),
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: `${stringName}[]`,
      description: { text: 'the tags', html: 'the tags' },
    },
    modifiers,
    deprecation: { forRemoval: false, text: null, html: null },
    annotations: [],
  };
  elements.set(tagsElement.id, tagsElement);

  const targetClassElement: AnnotationElementData = {
    entityType: EntityTypeEnum.AnnotationElement,
    id: 'targetClass',
    name: 'targetClass',
    description: {
      text: 'A class reference element.',
      html: 'A class reference element.',
    },
    signature: `${legacySignaturePrefix}Class<?> targetClass`,
    url: generateMemberUrl(baseUrl, 'targetClass'),
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'Class<?>',
      description: { text: 'the target class', html: 'the target class' },
    },
    modifiers,
    deprecation: { forRemoval: false, text: null, html: null },
    annotations: [],
  };
  elements.set(targetClassElement.id, targetClassElement);

  const policyElement: AnnotationElementData = {
    entityType: EntityTypeEnum.AnnotationElement,
    id: 'policy',
    name: 'policy',
    description: {
      text: 'An enum element.',
      html: 'An enum element.',
    },
    signature: `${legacySignaturePrefix}RetentionPolicy policy`,
    url: generateMemberUrl(baseUrl, 'policy'),
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'RetentionPolicy',
      description: { text: 'the enum', html: 'the enum' },
    },
    modifiers,
    deprecation: { forRemoval: false, text: null, html: null },
    annotations: [],
  };
  elements.set(policyElement.id, policyElement);

  return elements;
}

export function generateTestAnnotation(
  annotationPackage: PackageData,
  version: FixtureJavaVersion,
): AnnotationData {
  const url = generateObjectUrl(annotationPackage.url, 'TestAnnotation');
  const elements = generateElements(url, version);
  const valuePrefix = version <= 8 ? 'value=' : '';

  const id = generateObjectQualifiedName(
    annotationPackage.name,
    'TestAnnotation',
  );
  return {
    entityType: EntityTypeEnum.Annotation,
    id,
    qualifiedName: id,
    name: 'TestAnnotation',
    description: {
      text: [
        'This annotation is used to test all Javadoc scraping features for annotations.',
        '',
        ' It includes elements with defaults, multiple targets, retention policies,',
        ' and deprecation for testing coverage.',
      ].join('\n'),
      html: [
        'This annotation is used to test all Javadoc scraping features for annotations.',
        '',
        ' <p>It includes elements with defaults, multiple targets, retention policies,',
        ' and deprecation for testing coverage.</p>',
      ].join('\n'),
    },
    signature: `@Deprecated @Target(${valuePrefix}{TYPE,METHOD,FIELD}) @Retention(${valuePrefix}RUNTIME) public @interface TestAnnotation`,
    url,
    target: ElementTypeEnum.Type,
    targets: [
      ElementTypeEnum.Type,
      ElementTypeEnum.Method,
      ElementTypeEnum.Field,
    ],
    retention: RetentionPolicyEnum.Runtime,
    package: annotationPackage,
    elements,
    deprecation: {
      forRemoval: false,
      html: 'This annotation is deprecated for testing.',
      text: 'This annotation is deprecated for testing.',
    },
  };
}
