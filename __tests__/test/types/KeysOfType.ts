export type KeysOfType<Object, Type> = {
  [Key in keyof Object]: Object[Key] extends Type ? Key : never;
}[keyof Object][];
