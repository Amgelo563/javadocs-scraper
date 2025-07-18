import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import type { PackageQueryStrategy } from '../PackageQueryStrategy';

export class LegacyPackageQueryStrategy implements PackageQueryStrategy {
  /** Matches a non-breaking space character (Unicode \u00A0). */
  protected static readonly NoBreakSpaceRegex = /\xa0/;

  public queryRootTabs($root: CheerioAPI): Cheerio<Element> {
    return $root(
      '.contentContainer > .overviewSummary .colFirst > a, #all-packages-table th.col-first a',
    );
  }

  public queryPackageDescription($package: CheerioAPI): Cheerio<Element> {
    return $package('.header > .docSummary > .block');
  }

  public queryPackageSignatureText($package: CheerioAPI): string {
    return $package('h1')
      .text()
      .replace(LegacyPackageQueryStrategy.NoBreakSpaceRegex, ' ')
      .trim();
  }

  /** related packages weren't a thing in legacy */
  public queryRelatedPackages(_$package: CheerioAPI): null {
    return null;
  }

  public queryPackageContents($package: CheerioAPI): Cheerio<Element> {
    return $package('.colFirst a, .col-first a');
  }
}
