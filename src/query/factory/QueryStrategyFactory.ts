import type { CheerioAPI } from 'cheerio';
import { LegacyQueryStrategy } from '../legacy/LegacyQueryStrategy';
import { ModernQueryStrategy } from '../modern/ModernQueryStrategy';
import type { QueryStrategy } from '../QueryStrategy';

/** A factory for creating a {@link QueryStrategy} based on the root element's contents. */
export class QueryStrategyFactory {
  public create($root: CheerioAPI): QueryStrategy {
    const generator = $root('meta[name="generator"]').attr('content');
    if (generator === 'javadoc/PackageIndexWriter') {
      return new ModernQueryStrategy();
    }

    return new LegacyQueryStrategy();
  }
}
