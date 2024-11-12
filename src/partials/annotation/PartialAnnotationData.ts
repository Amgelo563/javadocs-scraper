import type { AnnotationData } from '../../entities/annotation/AnnotationData';
import type { PartialPackageData } from '../package/PartialPackageData';

export interface PartialAnnotationData extends Omit<AnnotationData, 'package'> {
  partialPackage: PartialPackageData;
}
