import type { KeysOfType } from './KeysOfType';

export type PrimitiveKeys<T> = KeysOfType<
  T,
  string | number | symbol | boolean | null
>;
