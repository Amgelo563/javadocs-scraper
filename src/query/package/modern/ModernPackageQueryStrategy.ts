import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { PackageQueryStrategy } from '../PackageQueryStrategy';

export class ModernPackageQueryStrategy implements PackageQueryStrategy {
  public queryRootTabs($root: CheerioAPI): Cheerio<Element> {
    return $root(
      '#all-packages-table > .summary-table > .col-first > a, #package-summary-table > .summary-table > .col-first > a',
    );
  }

  public queryPackageDescription($package: CheerioAPI): Cheerio<Element> {
    return $package('#package-description > .block');
  }

  public queryPackageSignatureText($package: CheerioAPI): string {
    return $package('div .package-signature').text();
  }

  public queryRelatedPackages($package: CheerioAPI): Cheerio<Element> {
    return $package(
      '#related-package-summary > .summary-table > .col-first:not(:first-child)',
    );
  }

  public queryPackageContents($package: CheerioAPI): Cheerio<Element> {
    return $package('.col-first:not(:first-child) a');
  }
}
