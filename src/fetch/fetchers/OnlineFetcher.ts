import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import { resolve } from 'url';
import type { Fetcher } from '../Fetcher';

/** A {@link Fetcher} for online Javadocs. */
export class OnlineFetcher implements Fetcher {
  protected readonly baseUrl: string;

  protected readonly cache = new Map<string, CheerioAPI>();

  protected readonly userAgent: string;

  constructor(baseUrl: string, userAgent?: string) {
    this.baseUrl =
      baseUrl.endsWith('/') || baseUrl.endsWith('.html')
        ? baseUrl
        : `${baseUrl}/`;

    const fallback = `npm:javadocs-scraper/${process.env.npm_package_version ?? 'unknown'}`;
    this.userAgent = userAgent ?? fallback;
  }

  public async fetch(url: string): Promise<{ $: CheerioAPI; fullUrl: string }> {
    const fullUrl = resolve(this.baseUrl, url);
    const present = this.cache.get(url);
    if (present) {
      return { $: present, fullUrl };
    }

    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': this.userAgent,
      },
      redirect: 'follow',
    });
    if (response.status === 404) {
      throw new Error('Received 404 from ' + fullUrl);
    }

    const text = await response.text();
    const $ = load(text, { baseURI: fullUrl });
    this.cache.set(url, $);

    return { $, fullUrl };
  }

  public async fetchRoot(): Promise<{ $: CheerioAPI; fullUrl: string }> {
    return this.fetch('');
  }

  public clearCache() {
    this.cache.clear();
  }
}
