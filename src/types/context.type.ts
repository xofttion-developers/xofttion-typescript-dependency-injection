export type ContextType = Map<string, unknown>;

export interface OnContext {
  setContext(context: ContextType): void;

  getValue<T = unknown>(key: string): T | undefined;
}

export class Context implements OnContext {
  protected context?: ContextType;

  public setContext(context: ContextType): void {
    this.context = context;
  }

  getValue<T = unknown>(key: string): T | undefined {
    return this.context && this.context.has(key)
      ? (this.context.get(key) as T)
      : undefined;
  }
}
