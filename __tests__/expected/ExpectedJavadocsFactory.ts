import { Collection } from '@discordjs/collection';
import { join } from 'path';
import type {
  AnnotationData,
  ClassData,
  EnumData,
  InterfaceData,
  PackageData,
} from '../../src';
import { Javadocs } from '../../src';
import type { FixtureJavaVersion } from '../test/FixtureJavaVersion';
import { generateAnnotationsPackage } from './annotation/packages/AnnotationsPackage';
import { generateClassesPackage } from './class/packages/ClassesPackage';
import { generateEnumsPackage } from './enum/packages/EnumsPackage';
import { generateInterfacesPackage } from './interface/packages/InterfacesPackage';

export function generateJavadocs(version: FixtureJavaVersion): Javadocs {
  const basePath = join(__dirname, '..');

  const packages = new Collection<string, PackageData>();

  const classes = new Collection<string, ClassData>();
  const classesPackage = generateClassesPackage(basePath, version);
  for (const classData of classesPackage.classes.values()) {
    classes.set(classData.id, classData);
  }
  packages.set(classesPackage.id, classesPackage);

  const interfaces = new Collection<string, InterfaceData>();
  const interfacesPackage = generateInterfacesPackage(basePath, version);
  for (const interfaceData of interfacesPackage.interfaces.values()) {
    interfaces.set(interfaceData.id, interfaceData);
  }
  packages.set(interfacesPackage.id, interfacesPackage);

  const enums = new Collection<string, EnumData>();
  const enumsPackage = generateEnumsPackage(basePath, version);
  for (const enumData of enumsPackage.enums.values()) {
    enums.set(enumData.id, enumData);
  }
  packages.set(enumsPackage.id, enumsPackage);

  const annotations = new Collection<string, AnnotationData>();
  const annotationsPackage = generateAnnotationsPackage(basePath, version);
  for (const annotationData of annotationsPackage.annotations.values()) {
    annotations.set(annotationData.id, annotationData);
  }
  packages.set(annotationsPackage.id, annotationsPackage);

  return new Javadocs({
    classes,
    packages,
    enums,
    interfaces,
    annotations,
  });
}
