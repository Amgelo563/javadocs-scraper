import { Collection } from '@discordjs/collection';
import type {
  FieldData,
  InterfaceData,
  MethodData,
  PackageData,
  ParameterData,
} from '../../../../src';
import {
  AccessModifierEnum,
  EntityTypeEnum,
  ModifierEnum,
} from '../../../../src';

import { StringNames } from '../../../constants/StringNames';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import { generateMemberUrl } from '../../general/member/MemberValuesFactory';
import {
  generateObjectQualifiedName,
  generateObjectUrl,
} from '../../general/object/ObjectValuesFactory';

function generateBaseInterfaceInheritedMethod(
  interfaceUrl: string,
  version: FixtureJavaVersion,
) {
  const xParameter = {
    entityType: EntityTypeEnum.Parameter,
    id: 'x',
    name: 'x',
    type: 'int',
    annotations: [],
    description: { text: 'a number', html: 'a number' },
    signature: 'int x',
  } as const satisfies ParameterData;

  const stringName = StringNames[version];

  return {
    entityType: EntityTypeEnum.Method,
    id: 'inheritedMethod(int)',
    prototype: 'inheritedMethod(int)',
    name: 'inheritedMethod',
    signature: `${stringName} inheritedMethod(int x)`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: stringName,
      description: {
        text: 'a stringified version of x',
        html: 'a stringified version of x',
      },
    },
    description: {
      text: 'A method to be inherited.',
      html: 'A method to be inherited.',
    },
    url: generateMemberUrl(interfaceUrl, 'inheritedMethod(int)'),
    deprecation: null,
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
    parameters: new Collection([[xParameter.id, xParameter]]),
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
  } as const satisfies MethodData<InterfaceData | null>;
}

function generateBaseInterfaceConstantField(
  interfaceUrl: string,
  version: FixtureJavaVersion,
) {
  const stringName = StringNames[version];
  return {
    entityType: EntityTypeEnum.Field,
    id: 'BASE_CONSTANT',
    name: 'BASE_CONSTANT',
    type: stringName,
    signature: `static final ${stringName} BASE_CONSTANT`,
    description: {
      text: 'A shared constant for inherited field-testing.',
      html: 'A shared constant for inherited field-testing.',
    },
    url: generateMemberUrl(interfaceUrl, 'BASE_CONSTANT'),
    accessModifier: AccessModifierEnum.Public,
    deprecation: null,
    modifiers: [ModifierEnum.Static, ModifierEnum.Final],
    inheritedFrom: null,
  } as const satisfies FieldData<InterfaceData | null>;
}

export function generateBaseInterface(
  interfacePackage: PackageData,
  version: FixtureJavaVersion,
) {
  const url = generateObjectUrl(interfacePackage.url, 'BaseInterface');
  const inheritedMethod = generateBaseInterfaceInheritedMethod(url, version);
  const constantField = generateBaseInterfaceConstantField(url, version);

  const id = generateObjectQualifiedName(
    interfacePackage.name,
    'BaseInterface',
  );
  return {
    entityType: EntityTypeEnum.Interface,
    id,
    qualifiedName: id,
    name: 'BaseInterface',
    signature: 'public interface BaseInterface',
    description: {
      text: [
        'A base interface for testing local inheritance.',
        '',
        ' This interface exists to be extended by other local interfaces for testing inherited members.',
      ].join('\n'),
      html: [
        'A base interface for testing local inheritance.',
        '',
        ' <p>This interface exists to be extended by other local interfaces for testing inherited members.</p>',
      ].join('\n'),
    },
    url,
    package: interfacePackage,
    methods: new Collection([[inheritedMethod.id, inheritedMethod]]),
    fields: new Collection([[constantField.id, constantField]]),
    deprecation: null,
    extends: new Collection(),
    typeParameters: new Collection(),
  } as const satisfies InterfaceData;
}
