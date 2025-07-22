import { Collection } from '@discordjs/collection';
import type { AnnotationData } from '../entities/annotation/AnnotationData';
import type { PackageData } from '../entities/package/PackageData';
import { EntityTypeEnum } from '../entities/type/EntityType';
import type { PartialAnnotationData } from '../partials/annotation/PartialAnnotationData';
import type { ScrapeCache } from '../scrapers/cache/ScrapeCache';

/** Patches {@link PartialAnnotationData} to {@link AnnotationData}. */
export class AnnotationPatcher {
  public patchAnnotations(
    cache: ScrapeCache,
    packages: Collection<string, PackageData>,
  ): Collection<string, AnnotationData> {
    const annotations = new Collection<string, AnnotationData>();
    for (const [_name, annotationData] of cache.partialAnnotations) {
      const patched = this.patchAnnotation(packages, annotationData);
      annotations.set(patched.id, patched);
    }
    return annotations;
  }

  protected patchAnnotation(
    packages: Collection<string, PackageData>,
    annotationData: PartialAnnotationData,
  ): AnnotationData {
    const packageData = packages.get(annotationData.partialPackage.id);
    if (!packageData) {
      throw new Error(
        `Package ${annotationData.qualifiedName} not found, but is package from annotation ${annotationData.qualifiedName}`,
      );
    }

    const fullyPatched: AnnotationData = {
      package: packageData,
      qualifiedName: annotationData.qualifiedName,
      url: annotationData.url,
      target: annotationData.target,
      targets: annotationData.targets,
      retention: annotationData.retention,
      elements: annotationData.elements,
      deprecation: annotationData.deprecation,
      entityType: EntityTypeEnum.Annotation,
      id: annotationData.id,
      name: annotationData.name,
      description: annotationData.description,
      signature: annotationData.signature,
    };

    packageData.annotations.set(fullyPatched.id, fullyPatched);

    return fullyPatched;
  }
}
