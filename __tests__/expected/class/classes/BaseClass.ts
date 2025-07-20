import { Collection } from '@discordjs/collection';
import type { ClassData, MethodData, PackageData } from '../../../../src';
import { AccessModifierEnum, EntityTypeEnum } from '../../../../src';
import { ObjectNames } from '../../../constants/ObjectNames';
import { StringNames } from '../../../constants/StringNames';
import type { FixtureJavaVersion } from '../../../test/FixtureJavaVersion';
import { supportsExternalObjects } from '../../../test/FixtureJavaVersion';
import { generateObjectClass } from '../../external/ObjectClass';
import { generateMemberUrl } from '../../general/member/MemberValuesFactory';
import {
  generateObjectQualifiedName,
  generateObjectUrl,
} from '../../general/object/ObjectValuesFactory';

function generateBaseClassBaseMethod(
  classUrl: string,
  version: FixtureJavaVersion,
) {
  const stringName = StringNames[version];

  return {
    entityType: EntityTypeEnum.Method,
    id: 'baseMethod()',
    prototype: 'baseMethod()',
    name: 'baseMethod',
    signature: `public ${stringName} baseMethod()`,
    returns: {
      entityType: EntityTypeEnum.MethodReturn,
      type: stringName,
      description: { text: 'a base string', html: 'a base string' },
    },
    description: { text: 'Base method.', html: 'Base method.' },
    url: generateMemberUrl(classUrl, 'baseMethod()'),
    accessModifier: AccessModifierEnum.Public,
    typeParameters: new Collection(),
    parameters: new Collection(),
    deprecation: null,
    modifiers: [],
    annotations: [],
    inheritedFrom: null,
  } as const satisfies MethodData<ClassData | null>;
}

export function generateBaseClass(
  classPackage: PackageData,
  version: FixtureJavaVersion,
) {
  const url = generateObjectUrl(classPackage.url, 'BaseClass');
  const baseMethod = generateBaseClassBaseMethod(url, version);
  const objectName = ObjectNames[version];

  let extension: ClassData['extends'] = null;
  if (supportsExternalObjects(version)) {
    extension = generateObjectClass(version);
  }

  const id = generateObjectQualifiedName(classPackage.name, 'BaseClass');
  return {
    entityType: EntityTypeEnum.Class,
    id,
    qualifiedName: id,
    name: 'BaseClass',
    signature: `public class BaseClass extends ${objectName}`,
    description: {
      text: 'Base class that TestClass extends.',
      html: 'Base class that TestClass extends.',
    },
    url,
    package: classPackage,
    methods: new Collection([[baseMethod.id, baseMethod]]),
    fields: new Collection(),
    modifiers: [],
    deprecation: null,
    implements: new Collection(),
    extends: extension,
    typeParameters: new Collection(),
  } as const satisfies ClassData;
}
