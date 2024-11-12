/** Data for a node's content, either in raw text or html. */
export interface NodeContent {
  /** The text content. */
  text: string | null;
  /** The HTML content. */
  html: string | null;
}
