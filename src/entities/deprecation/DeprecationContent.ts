import type { NodeContent } from '../node/NodeContent';

/** Content of a deprecated element. */
export interface DeprecationContent extends NodeContent {
  /** Whether the deprecated element is marked for removal in a future version. */
  forRemoval: boolean;
}
