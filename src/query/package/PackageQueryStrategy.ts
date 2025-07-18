import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';

export interface PackageQueryStrategy {
  queryRootTabs($root: CheerioAPI): Cheerio<Element>;
  queryPackageSignatureText($package: CheerioAPI): string;
  queryPackageDescription($package: CheerioAPI): Cheerio<Element>;
  queryRelatedPackages($package: CheerioAPI): Cheerio<Element> | null;
  queryPackageContents($package: CheerioAPI): Cheerio<Element>;
}
