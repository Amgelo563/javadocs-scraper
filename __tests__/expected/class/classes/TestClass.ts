import { Collection } from '@discordjs/collection';
import type {
  ExternalEntityData,
  FieldData,
  InterfaceData,
  MethodTypeParameterData,
  ObjectTypeParameterData,
  ParameterData,
} from '../../../../src';
import {
  AccessModifierEnum,
  type ClassData,
  EntityTypeEnum,
  type MethodData,
  ModifierEnum,
  type PackageData,
} from '../../../../src';
import { ListNames } from '../../../constants/ListNames';
import { NumberNames } from '../../../constants/NumberNames';
import { StringNames } from '../../../constants/StringNames';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import {
  supportsDeprecationForRemoval,
  supportsExternalObjects,
} from '../../../test/FixtureJavaVersion';
import { generateCloneableInterface } from '../../external/CloneableInterface';
import { generateSerializableInterface } from '../../external/SerializableInterface';
import { generateMemberUrl } from '../../general/member/MemberValuesFactory';
import {
  generateObjectQualifiedName,
  generateObjectUrl,
} from '../../general/object/ObjectValuesFactory';

//# Methods

function generateDoSomethingMethod(
  classUrl: string,
  version: FixtureJavaVersion,
) {
  const stringName = StringNames[version];

  const parameter: ParameterData = {
    entityType: EntityTypeEnum.Parameter,
    id: 'input',
    name: 'input',
    type: stringName,
    signature: `${stringName} input`,
    description: { text: 'input data', html: 'input data' },
    annotations: [],
  };
  return {
    entityType: EntityTypeEnum.Method,
    id: 'doSomething(java.lang.String)',
    prototype: 'doSomething(java.lang.String)',
    name: 'doSomething',
    signature: `public ${stringName} doSomething(${stringName} input)`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: stringName,
      description: { text: 'the result string', html: 'the result string' },
    },
    description: {
      text: 'A method that does something.',
      html: 'A method that does something.',
    },
    url: generateMemberUrl(classUrl, 'doSomething(java.lang.String)'),
    accessModifier: AccessModifierEnum.Public,
    typeParameters: new Collection(),
    parameters: new Collection([[parameter.id, parameter]]),
    deprecation: {
      forRemoval: false,
      text: null,
      html: null,
    },
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
  } as const satisfies MethodData<ClassData | null>;
}

function generateWrapItemMethod(classUrl: string, version: FixtureJavaVersion) {
  const parameter = {
    entityType: EntityTypeEnum.Parameter,
    name: 'item',
    id: 'item',
    type: 'T',
    signature: 'T item',
    description: { text: 'the item', html: 'the item' },
    annotations: [],
  } as const satisfies ParameterData;
  const typeParameter = {
    entityType: EntityTypeEnum.MethodTypeParameter,
    id: 'T',
    name: 'T',
    extends: null,
    description: { html: 'type parameter', text: 'type parameter' },
    signature: 'T',
  } as const satisfies MethodTypeParameterData;

  const itemType = version >= 15 ? 'T' : 'java.lang.Object';
  const listName = ListNames[version];

  return {
    entityType: EntityTypeEnum.Method,
    id: `wrapItem(${itemType})`,
    prototype: `wrapItem(${itemType})`,
    name: 'wrapItem',
    signature: `public <T> ${listName}<T> wrapItem(T item)`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: `${listName}<T>`,
      description: {
        text: 'a list containing the item',
        html: 'a list containing the item',
      },
    },
    description: {
      text: 'A generic method with type parameters.',
      html: 'A generic method with type parameters.',
    },
    url: generateMemberUrl(classUrl, `wrapItem(${itemType})`),
    accessModifier: AccessModifierEnum.Public,
    typeParameters: new Collection([[typeParameter.id, typeParameter]]),
    parameters: new Collection([[parameter.id, parameter]]),
    deprecation: {
      forRemoval: false,
      text: null,
      html: null,
    },
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
  } as const satisfies MethodData<null>;
}

function generateOldMethod(classUrl: string) {
  return {
    entityType: EntityTypeEnum.Method,
    id: 'oldMethod()',
    prototype: 'oldMethod()',
    name: 'oldMethod',
    signature: '@Deprecated public void oldMethod()',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'void',
      description: null,
    },
    description: { text: 'A deprecated method.', html: 'A deprecated method.' },
    url: generateMemberUrl(classUrl, 'oldMethod()'),
    accessModifier: AccessModifierEnum.Public,
    typeParameters: new Collection(),
    parameters: new Collection(),
    deprecation: {
      forRemoval: false,
      text: 'This method is outdated.',
      html: 'This method is outdated.',
    },
    modifiers: [],
    annotations: ['@Deprecated'],
    inheritedFrom: null,
  } as const satisfies MethodData<null>;
}

function generateOldMethodForRemoval(classUrl: string) {
  return {
    entityType: EntityTypeEnum.Method,
    id: 'oldMethodForRemoval()',
    prototype: 'oldMethodForRemoval()',
    name: 'oldMethodForRemoval',
    signature: '@Deprecated(forRemoval=true) public void oldMethodForRemoval()',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'void',
      description: null,
    },
    description: {
      text: 'A deprecated for removal method.',
      html: 'A deprecated for removal method.',
    },
    url: generateMemberUrl(classUrl, 'oldMethodForRemoval()'),
    accessModifier: AccessModifierEnum.Public,
    typeParameters: new Collection(),
    parameters: new Collection(),
    deprecation: {
      forRemoval: true,
      text: 'This method is outdated and will be removed.',
      html: 'This method is outdated and will be removed.',
    },
    modifiers: [],
    annotations: ['@Deprecated(forRemoval=true)'],
    inheritedFrom: null,
  } as const satisfies MethodData<null>;
}

function generatePutMethod(classUrl: string, version: FixtureJavaVersion) {
  const parameterK: ParameterData = {
    entityType: EntityTypeEnum.Parameter,
    id: 'key',
    name: 'key',
    annotations: [],
    description: { text: 'the key', html: 'the key' },
    signature: 'K key',
    type: 'K',
  } as const;
  const parameterV: ParameterData = {
    entityType: EntityTypeEnum.Parameter,
    id: 'value',
    name: 'value',
    annotations: [],
    description: { text: 'the value', html: 'the value' },
    signature: 'V value',
    type: 'V',
  } as const;

  const parameters: Collection<string, ParameterData> = new Collection([
    [parameterK.id, parameterK],
    [parameterV.id, parameterV],
  ]);

  const id =
    version >= 15 ? 'put(K,V)' : 'put(java.lang.Object,java.lang.Number)';

  return {
    entityType: EntityTypeEnum.Method,
    id,
    prototype: id,
    name: 'put',
    signature: 'public abstract void put(K key, V value)',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'void',
      description: null,
    },
    description: {
      text: 'An abstract method to implement.',
      html: 'An abstract method to implement.',
    },
    url: generateMemberUrl(classUrl, 'put(K,V)'),
    accessModifier: AccessModifierEnum.Public,
    typeParameters: new Collection(),
    parameters,
    modifiers: [ModifierEnum.Abstract],
    deprecation: {
      forRemoval: false,
      text: null,
      html: null,
    },
    annotations: [],
    inheritedFrom: null,
  } as const satisfies MethodData<null>;
}

function generateCloneMethod(classUrl: string) {
  return {
    entityType: EntityTypeEnum.Method,
    id: 'clone()',
    prototype: 'clone()',
    name: 'clone',
    signature: 'public TestClass<K,V> clone()',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'TestClass<K,V>',
      description: null,
    },
    description: null,
    url: generateMemberUrl(classUrl, 'clone()'),
    accessModifier: AccessModifierEnum.Public,
    typeParameters: new Collection(),
    parameters: new Collection(),
    deprecation: { forRemoval: false, text: null, html: null },
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
  } as const satisfies MethodData<null>;
}

//# Fields

function generateStaticField(classUrl: string, version: FixtureJavaVersion) {
  const stringName = StringNames[version];
  return {
    entityType: EntityTypeEnum.Field,
    id: 'STATIC_FIELD',
    name: 'STATIC_FIELD',
    type: stringName,
    signature: `public static final ${stringName} STATIC_FIELD`,
    description: {
      text: 'Public constant field.',
      html: 'Public constant field.',
    },
    url: generateMemberUrl(classUrl, 'STATIC_FIELD'),
    accessModifier: AccessModifierEnum.Public,
    modifiers: [ModifierEnum.Static, ModifierEnum.Final],
    deprecation: { forRemoval: false, text: null, html: null },
    inheritedFrom: null,
  } as const satisfies FieldData<null>;
}

function generateDataListField(classUrl: string, version: FixtureJavaVersion) {
  const listName = ListNames[version];
  return {
    entityType: EntityTypeEnum.Field,
    id: 'dataList',
    name: 'dataList',
    type: `${listName}<K>`,
    signature: `protected ${listName}<K> dataList`,
    description: {
      text: 'Protected list field.',
      html: 'Protected list field.',
    },
    url: generateMemberUrl(classUrl, 'dataList'),
    accessModifier: AccessModifierEnum.Protected,
    modifiers: [],
    deprecation: {
      forRemoval: false,
      text: null,
      html: null,
    },
    inheritedFrom: null,
  } as const satisfies FieldData<null>;
}

function generateOldField(classUrl: string, version: FixtureJavaVersion) {
  let valueMention: string;
  switch (version) {
    case 8:
    case 9:
    case 10:
      valueMention =
        '<a href="../../../../me/amgelo563/javadocsgen/classes/TestClass.html#value"><code>value</code></a>';
      break;
    case 11:
      valueMention = '<a href="#value"><code>value</code></a>';
      break;
    default:
      valueMention = '<code>value</code>';
  }

  return {
    entityType: EntityTypeEnum.Field,
    id: 'oldField',
    name: 'oldField',
    type: 'int',
    signature: '@Deprecated public int oldField',
    description: {
      text: 'A deprecated field.',
      html: 'A deprecated field.',
    },
    url: generateMemberUrl(classUrl, 'oldField'),
    accessModifier: AccessModifierEnum.Public,
    modifiers: [],
    deprecation: {
      forRemoval: false,
      text: 'Use value instead.',
      html: `Use ${valueMention} instead.`,
    },
    inheritedFrom: null,
  } as const satisfies FieldData<null>;
}

// # Type parameters

function generateKTypeParameter() {
  return {
    entityType: EntityTypeEnum.ObjectTypeParameter,
    id: 'K',
    name: 'K',
    extends: null,
    description: { text: 'the key type', html: 'the key type' },
    signature: 'K',
  } as const satisfies ObjectTypeParameterData;
}

function generateVTypeParameter() {
  return {
    entityType: EntityTypeEnum.ObjectTypeParameter,
    id: 'V',
    name: 'V',
    extends: 'Number',
    description: {
      text: 'the value type that must extend Number',
      html: 'the value type that must extend Number',
    },
    signature: 'V extends Number',
  } as const satisfies ObjectTypeParameterData;
}

export function generateTestClass(options: {
  classPackage: PackageData;
  baseClass: ClassData;
  version: FixtureJavaVersion;
}) {
  const { classPackage, baseClass, version } = options;
  const includeForRemoval = supportsDeprecationForRemoval(version);

  const methodsArray: MethodData<ClassData | null>[] = [
    generateDoSomethingMethod(classPackage.url, version),
    generateWrapItemMethod(classPackage.url, version),
    generateOldMethod(classPackage.url),
    generatePutMethod(classPackage.url, version),
    generateCloneMethod(classPackage.url),
    ...baseClass.methods
      .filter((method) => method.accessModifier !== AccessModifierEnum.Private)
      .map((method) => ({
        ...method,
        inheritedFrom: baseClass,
      })),
  ];
  if (includeForRemoval) {
    methodsArray.push(generateOldMethodForRemoval(classPackage.url));
  }
  const methods = new Collection(
    methodsArray.map((method) => [method.id, method] as const),
  );

  const fieldsArray: FieldData<null>[] = [
    generateStaticField(classPackage.url, version),
    generateDataListField(classPackage.url, version),
    generateOldField(classPackage.url, version),
  ];
  const fields = new Collection(
    fieldsArray.map((field) => [field.id, field] as const),
  );

  const implementsCollection: ClassData['implements'] = new Collection();
  const implementsArray: (InterfaceData | ExternalEntityData)[] = [
    generateSerializableInterface(version),
    generateCloneableInterface(version),
  ];
  if (supportsExternalObjects(version)) {
    implementsArray.forEach((i) => implementsCollection.set(i.id, i));
  }

  const typeParametersArray: ObjectTypeParameterData[] = [
    generateKTypeParameter(),
    generateVTypeParameter(),
  ];
  const typeParameters = new Collection(
    typeParametersArray.map((param) => [param.id, param] as const),
  );

  const id = generateObjectQualifiedName(classPackage.name, 'TestClass');
  return {
    entityType: EntityTypeEnum.Class,
    id,
    qualifiedName: id,
    name: 'TestClass',
    signature: `@Deprecated public abstract class TestClass<K,V extends ${NumberNames[version]}> extends BaseClass implements ${implementsArray.map((i) => i.name).join(', ')}`,
    description: {
      text: [
        'This is a test class for verifying Javadoc scraping on class entities.',
        '',
        ' Includes generic type parameters, inheritance, method overloads, fields,',
        ' annotations, modifiers, deprecated elements, and interfaces.',
      ].join('\n'),
      html: [
        'This is a test class for verifying Javadoc scraping on class entities.',
        '',
        ' <p>Includes generic type parameters, inheritance, method overloads, fields,',
        ' annotations, modifiers, deprecated elements, and interfaces.</p>',
      ].join('\n'),
    },
    url: generateObjectUrl(classPackage.url, 'TestClass'),
    package: classPackage,
    methods,
    fields,
    modifiers: [ModifierEnum.Abstract],
    deprecation: {
      forRemoval: false,
      text: 'This class is deprecated for test purposes.',
      html: 'This class is deprecated for test purposes.',
    },
    implements: implementsCollection,
    extends: baseClass,
    typeParameters,
  } as const satisfies ClassData;
}
