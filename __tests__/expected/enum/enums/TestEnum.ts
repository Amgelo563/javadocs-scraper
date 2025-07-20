import { Collection } from '@discordjs/collection';
import type {
  EnumConstantData,
  EnumData,
  FieldData,
  MethodData,
  PackageData,
} from '../../../../src';
import {
  AccessModifierEnum,
  EntityTypeEnum,
  ModifierEnum,
} from '../../../../src';
import { EnumNames } from '../../../constants/EnumNames';
import { StringNames } from '../../../constants/StringNames';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import { generateSupplierInterface } from '../../external/SupplierInterface';
import { generateMemberUrl } from '../../general/member/MemberValuesFactory';
import {
  generateObjectQualifiedName,
  generateObjectUrl,
} from '../../general/object/ObjectValuesFactory';

const NBSP = '\u00A0';

function generateValuesMethod(
  enumUrl: string,
  version: FixtureJavaVersion,
): MethodData<null> {
  const enumKind = version >= 16 ? 'enum class' : 'enum type';
  let descriptionText = `Returns an array containing the constants of this ${enumKind}, in\nthe order they are declared.`;
  let descriptionHtml = `Returns an array containing the constants of this ${enumKind}, in\nthe order they are declared.`;

  switch (version) {
    // java 8 had a typo with an extra space
    case 8:
      descriptionText += ' ';
      descriptionHtml += ' ';
    // eslint-disable-next-line no-fallthrough
    case 9:
    case 10:
    case 11:
      descriptionText += [
        ' This method may be used to iterate',
        'over the constants as follows:',
        'for (TestEnum c : TestEnum.values())',
        `${NBSP}   System.out.println(c);`,
      ].join('\n');
      descriptionHtml += [
        ' This method may be used to iterate',
        'over the constants as follows:',
        '<pre>for (TestEnum c : TestEnum.values())',
        '&nbsp;   System.out.println(c);',
        '</pre>',
      ].join('\n');
  }

  return {
    entityType: EntityTypeEnum.Method,
    id: 'values()',
    prototype: 'values()',
    name: 'values',
    url: generateMemberUrl(enumUrl, 'values()'),
    description: {
      text: descriptionText,
      html: descriptionHtml,
    },
    modifiers: [ModifierEnum.Static],
    parameters: new Collection(),
    signature: 'public static TestEnum[] values()',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'TestEnum[]',
      description: {
        text: `an array containing the constants of this ${enumKind}, in the order they are declared`,
        html: `an array containing the constants of this ${enumKind}, in the order they are declared`,
      },
    },
    annotations: [],
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
    deprecation: { forRemoval: false, text: null, html: null },
    inheritedFrom: null,
  };
}

function generateValueOfMethod(
  enumUrl: string,
  version: FixtureJavaVersion,
): MethodData<null> {
  const enumKind = version >= 16 ? 'class' : 'type';
  const stringName = StringNames[version];
  return {
    entityType: EntityTypeEnum.Method,
    id: 'valueOf(java.lang.String)',
    prototype: 'valueOf(java.lang.String)',
    name: 'valueOf',
    url: generateMemberUrl(enumUrl, 'valueOf(java.lang.String)'),
    description: {
      text: [
        `Returns the enum constant of this ${enumKind} with the specified name.`,
        'The string must match exactly an identifier used to declare an',
        `enum constant in this ${enumKind}.  (Extraneous whitespace characters are`,
        'not permitted.)',
      ].join('\n'),
      html: [
        `Returns the enum constant of this ${enumKind} with the specified name.`,
        'The string must match <i>exactly</i> an identifier used to declare an',
        `enum constant in this ${enumKind}.  (Extraneous whitespace characters are`,
        'not permitted.)',
      ].join('\n'),
    },
    modifiers: [ModifierEnum.Static],
    parameters: new Collection([
      [
        'name',
        {
          entityType: EntityTypeEnum.Parameter,
          id: 'name',
          name: 'name',
          type: stringName,
          annotations: [],
          description: {
            text: 'the name of the enum constant to be returned',
            html: 'the name of the enum constant to be returned',
          },
          signature: 'String name',
        },
      ],
    ]),
    signature: `public static TestEnum valueOf(${stringName} name)`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'TestEnum',
      description: {
        text: 'the enum constant with the specified name',
        html: 'the enum constant with the specified name',
      },
    },
    annotations: [],
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
    deprecation: { forRemoval: false, text: null, html: null },
    inheritedFrom: null,
  };
}

function generateGetMethod(
  enumUrl: string,
  version: FixtureJavaVersion,
): MethodData<null> {
  const stringName = StringNames[version];
  return {
    entityType: EntityTypeEnum.Method,
    id: 'get()',
    prototype: 'get()',
    name: 'get',
    url: generateMemberUrl(enumUrl, 'get()'),
    description: {
      text: 'Returns the string value of the status.',
      html: 'Returns the string value of the status.',
    },
    modifiers: [],
    parameters: new Collection(),
    signature: `public ${stringName} get()`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: stringName,
      description: {
        text: 'the value',
        html: 'the value',
      },
    },
    annotations: [],
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
    deprecation: { forRemoval: false, text: null, html: null },
    inheritedFrom: null,
  };
}

function generateCountMethod(enumUrl: string): MethodData<null> {
  return {
    entityType: EntityTypeEnum.Method,
    id: 'count()',
    prototype: 'count()',
    name: 'count',
    url: generateMemberUrl(enumUrl, 'count()'),
    description: {
      text: 'A static helper method.',
      html: 'A static helper method.',
    },
    modifiers: [ModifierEnum.Static],
    parameters: new Collection(),
    signature: 'public static int count()',
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: 'int',
      description: {
        text: 'total number of status values',
        html: 'total number of status values',
      },
    },
    annotations: [],
    typeParameters: new Collection(),
    accessModifier: AccessModifierEnum.Public,
    deprecation: { forRemoval: false, text: null, html: null },
    inheritedFrom: null,
  };
}

function generateOtherValueField(
  enumUrl: string,
  version: FixtureJavaVersion,
): FieldData<null> {
  const stringName = StringNames[version];
  return {
    entityType: EntityTypeEnum.Field,
    id: 'otherValue',
    name: 'otherValue',
    url: generateMemberUrl(enumUrl, 'otherValue'),
    description: {
      text: 'The other value of the status.',
      html: 'The other value of the status.',
    },
    type: stringName,
    modifiers: [ModifierEnum.Final],
    signature: `public final ${stringName} otherValue`,
    accessModifier: AccessModifierEnum.Public,
    deprecation: { forRemoval: false, text: null, html: null },
    inheritedFrom: null,
  };
}

function generateConstants(
  enumUrl: string,
): Collection<string, EnumConstantData> {
  return new Collection<string, EnumConstantData>([
    [
      'PENDING',
      {
        entityType: EntityTypeEnum.EnumConstant,
        id: 'PENDING',
        name: 'PENDING',
        url: generateMemberUrl(enumUrl, 'PENDING'),
        description: {
          text: 'Indicates a pending status.',
          html: 'Indicates a pending status.',
        },
        ordinal: 0,
        signature: 'public static final TestEnum PENDING',
        deprecation: { forRemoval: false, text: null, html: null },
      },
    ],
    [
      'ACTIVE',
      {
        entityType: EntityTypeEnum.EnumConstant,
        id: 'ACTIVE',
        name: 'ACTIVE',
        url: generateMemberUrl(enumUrl, 'ACTIVE'),
        description: {
          text: 'Indicates an active status.',
          html: 'Indicates an active status.',
        },
        ordinal: 1,
        signature: 'public static final TestEnum ACTIVE',
        deprecation: { forRemoval: false, text: null, html: null },
      },
    ],
    [
      'DEPRECATED',
      {
        entityType: EntityTypeEnum.EnumConstant,
        id: 'DEPRECATED',
        name: 'DEPRECATED',
        url: generateMemberUrl(enumUrl, 'DEPRECATED'),
        description: {
          text: 'Indicates a deprecated status.',
          html: 'Indicates a deprecated status.',
        },
        ordinal: 2,
        signature: '@Deprecated public static final TestEnum DEPRECATED',
        deprecation: {
          forRemoval: false,
          text: 'This constant is deprecated.',
          html: 'This constant is deprecated.',
        },
      },
    ],
  ]);
}

export function generateTestEnum(
  enumPackage: PackageData,
  version: FixtureJavaVersion,
): EnumData {
  const url = generateObjectUrl(enumPackage.url, 'TestEnum');
  const constants = generateConstants(url);
  const enumName = EnumNames[version];
  const stringName = StringNames[version];
  const supplierInterface = generateSupplierInterface(version);

  let supplierMention: string;
  const implementations: EnumData['implements'] = new Collection();
  if (version >= 16) {
    supplierMention = `<a href="${supplierInterface.url}" title="class or interface in java.util.function" class="external-link"><code>Supplier</code></a>`;
    implementations.set(supplierInterface.id, supplierInterface);
  } else {
    supplierMention = '<code>Supplier</code>';
  }

  const id = generateObjectQualifiedName(enumPackage.name, 'TestEnum');
  return {
    entityType: EntityTypeEnum.Enum,
    id,
    qualifiedName: id,
    name: 'TestEnum',
    signature: `@Deprecated public enum TestEnum extends ${enumName}<TestEnum> implements ${supplierInterface.name}<${stringName}>`,
    description: {
      text: [
        'Represents different statuses with detailed documentation.',
        '',
        ' This enum implements Supplier and demonstrates use of fields,',
        ' methods, deprecations, and enum constants with ordinal values.',
      ].join('\n'),
      html: [
        'Represents different statuses with detailed documentation.',
        '',
        ` <p>This enum implements ${supplierMention} and demonstrates use of fields,`,
        ' methods, deprecations, and enum constants with ordinal values.</p>',
      ].join('\n'),
    },
    url,
    package: enumPackage,
    constants,
    methods: new Collection([
      ['values()', generateValuesMethod(url, version)],
      ['valueOf(java.lang.String)', generateValueOfMethod(url, version)],
      ['get()', generateGetMethod(url, version)],
      ['count()', generateCountMethod(url)],
    ]),
    fields: new Collection([
      ['otherValue', generateOtherValueField(url, version)],
    ]),
    deprecation: {
      forRemoval: false,
      html: 'This enum is deprecated for testing purposes.',
      text: 'This enum is deprecated for testing purposes.',
    },
    implements: implementations,
  };
}
