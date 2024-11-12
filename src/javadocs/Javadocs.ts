import type { AnnotationData } from '../entities/annotation/AnnotationData';
import type { ClassData } from '../entities/class/ClassData';
import type { EnumData } from '../entities/enum/EnumData';
import type { InterfaceData } from '../entities/interface/InterfaceData';
import type { PackageData } from '../entities/package/PackageData';

/** Holds the result of a scraped Javadocs. */
export class Javadocs {
  protected readonly classes: Map<string, ClassData>;

  protected readonly packages: Map<string, PackageData>;

  protected readonly enums: Map<string, EnumData>;

  protected readonly interfaces: Map<string, InterfaceData>;

  protected readonly annotations: Map<string, AnnotationData>;

  constructor(data: {
    classes: Map<string, ClassData>;
    packages: Map<string, PackageData>;
    enums: Map<string, EnumData>;
    interfaces: Map<string, InterfaceData>;
    annotations: Map<string, AnnotationData>;
  }) {
    this.classes = data.classes;
    this.packages = data.packages;
    this.enums = data.enums;
    this.interfaces = data.interfaces;
    this.annotations = data.annotations;
  }

  public get size(): number {
    return (
      this.classes.size
      + this.packages.size
      + this.enums.size
      + this.interfaces.size
      + this.annotations.size
    );
  }

  /** Returns a class by its {@link ClassData#qualifiedName}. */
  public getClass(qualifiedName: string): ClassData | null {
    return this.classes.get(qualifiedName) || null;
  }

  /** Returns a package by its {@link PackageData#name}. */
  public getPackage(name: string): PackageData | null {
    return this.packages.get(name) || null;
  }

  /** Returns an enum by its {@link EnumData#qualifiedName}. */
  public getEnum(qualifiedName: string): EnumData | null {
    return this.enums.get(qualifiedName) || null;
  }

  /** Returns an interface by its {@link InterfaceData#qualifiedName}. */
  public getInterface(qualifiedName: string): InterfaceData | null {
    return this.interfaces.get(qualifiedName) || null;
  }

  /** Returns an annotation by its {@link AnnotationData#qualifiedName}. */
  public getAnnotation(qualifiedName: string): AnnotationData | null {
    return this.annotations.get(qualifiedName) || null;
  }

  /** Returns all the classes in the Javadocs. */
  public getClasses(): Map<string, ClassData> {
    return this.classes;
  }

  /** Returns all the packages in the Javadocs. */
  public getPackages(): Map<string, PackageData> {
    return this.packages;
  }

  /** Returns all the enums in the Javadocs. */
  public getEnums(): Map<string, EnumData> {
    return this.enums;
  }

  /** Returns all the interfaces in the Javadocs. */
  public getInterfaces(): Map<string, InterfaceData> {
    return this.interfaces;
  }

  /** Returns all the annotations in the Javadocs. */
  public getAnnotations(): Map<string, AnnotationData> {
    return this.annotations;
  }
}
