import type { CheerioAPI } from 'cheerio';

export interface Fetcher {
  fetch(url: string): Promise<{ $: CheerioAPI; fullUrl: string }>;
  fetchRoot(): Promise<{ $: CheerioAPI; fullUrl: string }>;
}
