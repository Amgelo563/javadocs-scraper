import { Collection } from '@discordjs/collection';
import type {
  ExternalEntityData,
  FieldData,
  InterfaceData,
  MethodData,
  MethodTypeParameterData,
  ObjectTypeParameterData,
  PackageData,
  ParameterData,
} from '../../../../src';
import {
  AccessModifierEnum,
  EntityTypeEnum,
  ModifierEnum,
} from '../../../../src';
import { ComparableNames } from '../../../constants/ComparableNames';
import { ListNames } from '../../../constants/ListNames';
import { NumberNames } from '../../../constants/NumberNames';
import { StringNames } from '../../../constants/StringNames';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import { supportsExternalObjects } from '../../../test/FixtureJavaVersion';
import { generateCloneableInterface } from '../../external/CloneableInterface';
import { generateSerializableInterface } from '../../external/SerializableInterface';
import { generateMemberUrl } from '../../general/member/MemberValuesFactory';
import {
  generateObjectQualifiedName,
  generateObjectUrl,
} from '../../general/object/ObjectValuesFactory';

// # Methods

function generateProcessMethod(
  interfaceUrl: string,
  version: FixtureJavaVersion,
): MethodData<null> {
  const stringName = StringNames[version];
  const comparableName = ComparableNames[version];

  const inputParameter = {
    entityType: EntityTypeEnum.Parameter,
    name: 'input',
    type: stringName,
    annotations: ['@Deprecated'],
    description: { text: 'the input value', html: 'the input value' },
    id: 'input',
    signature: `@Deprecated ${stringName} input`,
  } as const satisfies ParameterData;
  const vTypeParameter = {
    entityType: EntityTypeEnum.MethodTypeParameter,
    id: 'V',
    signature: `V extends ${comparableName}<V>`,
    name: 'V',
    extends: `${comparableName}<V>`,
    description: { html: 'a temporary type', text: 'a temporary type' },
  } as const satisfies MethodTypeParameterData;

  return {
    entityType: EntityTypeEnum.Method,
    id: 'process(java.lang.String)',
    prototype: 'process(java.lang.String)',
    name: 'process',
    signature: `<V extends ${comparableName}<V>> ${stringName} process(@Deprecated ${stringName} input)`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: stringName,
      description: { text: 'a result string', html: 'a result string' },
    },
    description: { text: 'Processes data.', html: 'Processes data.' },
    url: generateMemberUrl(interfaceUrl, `process(${stringName})`),
    deprecation: null,
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
    parameters: new Collection([[inputParameter.id, inputParameter]]),
    typeParameters: new Collection([[vTypeParameter.id, vTypeParameter]]),
    accessModifier: AccessModifierEnum.Public,
  };
}

function generateDoNothingMethod(interfaceUrl: string): MethodData<null> {
  return {
    entityType: EntityTypeEnum.Method,
    id: 'doNothing()',
    prototype: 'doNothing()',
    name: 'doNothing',
    signature: 'void doNothing()',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'void',
      description: null,
    },
    description: { text: 'A no-op method.', html: 'A no-op method.' },
    url: generateMemberUrl(interfaceUrl, 'doNothing()'),
    deprecation: null,
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
    parameters: new Collection(),
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
  };
}

function generateFetchDataMethod(
  interfaceUrl: string,
  version: FixtureJavaVersion,
): MethodData<null> {
  const listName = ListNames[version];
  const stringName = StringNames[version];

  const idParameter: ParameterData = {
    entityType: EntityTypeEnum.Parameter,
    name: 'id',
    type: 'int',
    annotations: [],
    description: { text: 'the ID', html: 'the ID' },
    id: 'id',
    signature: 'int id',
  } as const;
  const dataParameter: ParameterData = {
    entityType: EntityTypeEnum.Parameter,
    name: 'data',
    type: `${listName}<T>`,
    annotations: [],
    description: { text: 'the data', html: 'the data' },
    id: 'data',
    signature: `${listName}<T> data`,
  } as const;

  return {
    entityType: EntityTypeEnum.Method,
    id: 'fetchData(int,java.util.List)',
    prototype: 'fetchData(int,java.util.List)',
    name: 'fetchData',
    signature: `${listName}<${stringName}> fetchData(int id, ${listName}<T> data)`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: `${listName}<${stringName}>`,
      description: { text: 'a list of data', html: 'a list of data' },
    },
    description: {
      text: 'A method with multiple parameters.',
      html: 'A method with multiple parameters.',
    },
    url: generateMemberUrl(interfaceUrl, 'fetchData(int,java.util.List)'),
    deprecation: null,
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
    parameters: new Collection([
      [idParameter.id, idParameter],
      [dataParameter.id, dataParameter],
    ]),
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
  };
}

function generateOldMethod(interfaceUrl: string): MethodData<null> {
  return {
    entityType: EntityTypeEnum.Method,
    id: 'oldMethod()',
    prototype: 'oldMethod()',
    name: 'oldMethod',
    signature: '@Deprecated void oldMethod()',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'void',
      description: null,
    },
    description: { text: 'Deprecated method.', html: 'Deprecated method.' },
    url: generateMemberUrl(interfaceUrl, 'oldMethod()'),
    deprecation: {
      forRemoval: false,
      text: 'This method is deprecated for test coverage.',
      html: 'This method is deprecated for test coverage.',
    },
    modifiers: [],
    annotations: ['@Deprecated'],
    inheritedFrom: null,
    parameters: new Collection(),
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
  };
}

// # Fields

function generateConstantField(
  interfaceUrl: string,
  version: FixtureJavaVersion,
): FieldData<null> {
  const stringName = StringNames[version];
  return {
    entityType: EntityTypeEnum.Field,
    id: 'CONSTANT_FIELD',
    name: 'CONSTANT_FIELD',
    type: stringName,
    description: {
      text: 'A constant string field.',
      html: 'A constant string field.',
    },
    url: generateMemberUrl(interfaceUrl, 'CONSTANT_FIELD'),
    signature: `static final ${stringName} CONSTANT_FIELD`,
    modifiers: [ModifierEnum.Static, ModifierEnum.Final],
    deprecation: null,
    accessModifier: AccessModifierEnum.Public,
    inheritedFrom: null,
  };
}

function generateDeprecatedField(interfaceUrl: string): FieldData<null> {
  return {
    entityType: EntityTypeEnum.Field,
    id: 'DEPRECATED_FIELD',
    name: 'DEPRECATED_FIELD',
    type: 'int',
    description: { text: 'A deprecated field.', html: 'A deprecated field.' },
    url: generateMemberUrl(interfaceUrl, 'DEPRECATED_FIELD'),
    signature: '@Deprecated static final int DEPRECATED_FIELD',
    modifiers: [ModifierEnum.Static, ModifierEnum.Final],
    deprecation: {
      forRemoval: false,
      text: 'This field is deprecated for testing.',
      html: 'This field is deprecated for testing.',
    },
    accessModifier: AccessModifierEnum.Public,
    inheritedFrom: null,
  };
}

// # Type Parameters

function generateTTypeParameter(): ObjectTypeParameterData {
  return {
    entityType: EntityTypeEnum.ObjectTypeParameter,
    id: 'T',
    signature: 'T',
    name: 'T',
    extends: null,
    description: {
      html: 'the type of the items',
      text: 'the type of the items',
    },
  };
}

function generateUTypeParameter(
  version: FixtureJavaVersion,
): ObjectTypeParameterData {
  const numberName = NumberNames[version];
  return {
    entityType: EntityTypeEnum.ObjectTypeParameter,
    id: 'U',
    signature: `U extends ${numberName}`,
    name: 'U',
    extends: numberName,
    description: {
      html: 'the additional type with bounds',
      text: 'the additional type with bounds',
    },
  };
}

export function generateTestInterface(options: {
  interfacePackage: PackageData;
  baseInterface: InterfaceData;
  version: FixtureJavaVersion;
}): InterfaceData {
  const { interfacePackage, baseInterface, version } = options;
  const url = generateObjectUrl(interfacePackage.url, 'TestInterface');

  const methodsArray = [
    generateProcessMethod(url, version),
    generateDoNothingMethod(url),
    generateFetchDataMethod(url, version),
    generateOldMethod(url),
    ...baseInterface.methods.map((method) => ({
      ...method,
      inheritedFrom: baseInterface,
    })),
  ];
  const methods = new Collection<
    string,
    MethodData<null> | MethodData<InterfaceData>
  >(methodsArray.map((method) => [method.id, method] as const));

  const fieldsArray = [
    generateConstantField(url, version),
    generateDeprecatedField(url),
    ...baseInterface.fields.map((field) => ({
      ...field,
      inheritedFrom: baseInterface,
    })),
  ];
  const fields = new Collection(fieldsArray.map((field) => [field.id, field]));

  const typeParametersArray = [
    generateTTypeParameter(),
    generateUTypeParameter(version),
  ];
  const typeParameters = new Collection(
    typeParametersArray.map((typeParameter) => [
      typeParameter.id,
      typeParameter,
    ]),
  );

  const baseSignature = 'public interface TestInterface<T,U extends';
  const extensionsString = supportsExternalObjects(version)
    ? 'Number> extends Serializable, Cloneable, BaseInterface'
    : 'java.lang.Number> extends java.io.Serializable, java.lang.Cloneable, BaseInterface';

  let extensions: InterfaceData['extends'];
  if (supportsExternalObjects(version)) {
    const serializableInterface = generateSerializableInterface(version);
    const cloneableInterface = generateCloneableInterface(version);
    extensions = new Collection<string, ExternalEntityData | InterfaceData>([
      [serializableInterface.id, serializableInterface],
      [cloneableInterface.id, cloneableInterface],
      [baseInterface.id, baseInterface],
    ]);
  } else {
    extensions = new Collection([[baseInterface.id, baseInterface]]);
  }

  const id = generateObjectQualifiedName(
    interfacePackage.name,
    'TestInterface',
  );
  return {
    entityType: EntityTypeEnum.Interface,
    id,
    qualifiedName: id,
    name: 'TestInterface',
    signature: `${baseSignature} ${extensionsString}`,
    description: {
      text: [
        'This is a test interface for verifying Javadoc scraping.',
        '',
        ' This interface demonstrates multiple features such as type parameters,',
        ' inheritance, annotated parameters, and deprecation usage.',
      ].join('\n'),
      html: [
        'This is a test interface for verifying Javadoc scraping.',
        '',
        ' <p>This interface demonstrates multiple features such as type parameters,',
        ' inheritance, annotated parameters, and deprecation usage.</p>',
      ].join('\n'),
    },
    url,
    package: interfacePackage,
    methods,
    fields,
    deprecation: null,
    extends: extensions,
    typeParameters,
  };
}
