export type ContextType = Map<string, unknown>;

export interface OnContext {
  setContext(context: ContextType): void;

  getValue<T = unknown>(key: string): T | undefined;
}
