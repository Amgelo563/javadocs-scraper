import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import { readFile } from 'node:fs/promises';
import { resolve } from 'url';
import type { Fetcher } from '../Fetcher';

/** A {@link Fetcher} for local Javadocs. */
export class FileFetcher implements Fetcher {
  protected readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public async fetch(url: string): Promise<{
    $: CheerioAPI;
    fullUrl: string;
  }> {
    const fullUrl = resolve(this.basePath, url);
    const file = await readFile(fullUrl, 'utf-8');
    return {
      $: load(file),
      fullUrl,
    };
  }

  public async fetchRoot(): Promise<{
    $: CheerioAPI;
    fullUrl: string;
  }> {
    return this.fetch('');
  }
}
