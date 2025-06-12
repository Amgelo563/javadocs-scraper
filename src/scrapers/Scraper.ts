import type { Fetcher } from '../fetch/Fetcher';
import { FileFetcher } from '../fetch/fetchers/FileFetcher';
import { OnlineFetcher } from '../fetch/fetchers/OnlineFetcher';
import { Javadocs } from '../javadocs/Javadocs';
import { AnnotationPatcher } from '../patchers/AnnotationPatcher';
import { ClassPatcher } from '../patchers/ClassPatcher';
import { EnumPatcher } from '../patchers/EnumPatcher';
import { InterfacePatcher } from '../patchers/InterfacePatcher';
import { PackagePatcher } from '../patchers/PackagePatcher';
import { QueryStrategyFactory } from '../query/factory/QueryStrategyFactory';
import { AnnotationScraper } from './annotation/AnnotationScraper';
import { ScrapeCache } from './cache/ScrapeCache';
import { ClassScraper } from './class/ClassScraper';
import { EnumScraper } from './enum/EnumScraper';
import { FieldScraper } from './field/FieldScraper';
import { InheritanceScraper } from './inheritance/InheritanceScraper';
import { InterfaceScraper } from './interface/InterfaceScraper';
import { MethodScraper } from './method/MethodScraper';
import { BaseObjectScraper } from './object/BaseObjectScraper';
import { PackageScraper } from './package/PackageScraper';
import { RootScraper } from './root/RootScraper';

/** The entry point for the library. */
export class Scraper {
  protected readonly fetcher: Fetcher;

  protected readonly rootScraper: RootScraper;

  protected readonly packagePatcher: PackagePatcher;

  protected readonly interfacePatcher: InterfacePatcher;

  protected readonly enumPatcher: EnumPatcher;

  protected readonly classPatcher: ClassPatcher;

  protected readonly annotationPatcher: AnnotationPatcher;

  protected readonly scrapeCache = new ScrapeCache();

  protected readonly queryStrategyFactory: QueryStrategyFactory;

  constructor(options: {
    fetcher: Fetcher;
    rootScraper: RootScraper;
    packageScraper: PackageScraper;
    packagePatcher: PackagePatcher;
    interfacePatcher: InterfacePatcher;
    enumPatcher: EnumPatcher;
    classPatcher: ClassPatcher;
    annotationPatcher: AnnotationPatcher;
    queryStrategyFactory: QueryStrategyFactory;
  }) {
    this.fetcher = options.fetcher;
    this.rootScraper = options.rootScraper;
    this.packagePatcher = options.packagePatcher;
    this.interfacePatcher = options.interfacePatcher;
    this.enumPatcher = options.enumPatcher;
    this.classPatcher = options.classPatcher;
    this.annotationPatcher = options.annotationPatcher;
    this.queryStrategyFactory = options.queryStrategyFactory;
  }

  /** Creates a new {@link Scraper} from a URL. */
  public static fromURL(url: string): Scraper {
    const fetcher = new OnlineFetcher(url);
    return Scraper.with({ fetcher });
  }

  /** Creates a new {@link Scraper} from a local file path. */
  public static fromPath(path: string): Scraper {
    const fetcher = new FileFetcher(path);
    return Scraper.with({ fetcher });
  }

  /** Creates a new {@link Scraper} with a {@link Fetcher} and optional {@link QueryStrategyFactory}. */
  public static with(options: {
    fetcher: Fetcher;
    queryStrategyFactory?: QueryStrategyFactory;
  }): Scraper {
    const fetcher = options.fetcher;
    const queryStrategyFactory =
      options.queryStrategyFactory ?? new QueryStrategyFactory();

    const methodScraper = new MethodScraper();
    const fieldScraper = new FieldScraper();
    const inheritanceScraper = new InheritanceScraper();
    const baseObjectScraper = new BaseObjectScraper({
      fetcher,
      methodScraper,
      fieldScraper,
      inheritanceScraper,
    });

    const enumScraper = new EnumScraper(fetcher, baseObjectScraper);
    const interfaceScraper = new InterfaceScraper(fetcher, baseObjectScraper);
    const annotationScraper = new AnnotationScraper(fetcher, baseObjectScraper);
    const classScraper = new ClassScraper(fetcher, baseObjectScraper);
    const packageScraper = new PackageScraper({
      fetcher,
      interfaceScraper,
      enumScraper,
      annotationScraper,
      classScraper,
    });

    const rootScraper = new RootScraper(fetcher, packageScraper);

    const packagePatcher = new PackagePatcher();
    const interfacePatcher = new InterfacePatcher();
    const enumPatcher = new EnumPatcher();
    const classPatcher = new ClassPatcher();
    const annotationPatcher = new AnnotationPatcher();

    return new Scraper({
      fetcher,
      packageScraper,
      rootScraper,
      packagePatcher,
      interfacePatcher,
      enumPatcher,
      classPatcher,
      annotationPatcher,
      queryStrategyFactory,
    });
  }

  public async scrape() {
    const { $: $root } = await this.fetcher.fetchRoot();
    const queryStrategy = this.queryStrategyFactory.create($root);

    await this.rootScraper.scrape(this.scrapeCache, queryStrategy, $root);

    const packages = this.packagePatcher.patchPackages(this.scrapeCache);
    const interfaces = this.interfacePatcher.patchInterfaces(
      this.scrapeCache,
      packages,
    );
    const annotations = this.annotationPatcher.patchAnnotations(
      this.scrapeCache,
      packages,
    );
    const enums = this.enumPatcher.patchEnums(
      this.scrapeCache,
      packages,
      interfaces,
    );
    const classes = this.classPatcher.patchClasses(
      this.scrapeCache,
      packages,
      interfaces,
    );

    return new Javadocs({
      classes,
      packages,
      enums,
      interfaces,
      annotations,
    });
  }
}
