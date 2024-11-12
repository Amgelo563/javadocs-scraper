import type { NodeContent } from '../node/NodeContent';

/** Content of a deprecated element. */
export interface DeprecationContent extends NodeContent {
  /**
   * Whether the deprecated element is marked for removal in a future version.
   *
   * `null` if couldn't be determined (this option was added in [Java 9](https://openjdk.org/jeps/277))
   */
  forRemoval: boolean | null;
}
