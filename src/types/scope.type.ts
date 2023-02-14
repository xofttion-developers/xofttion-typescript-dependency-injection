export type ScopeType = Map<string, unknown>;

export interface OnScope {
  getValue<T = unknown>(key: string): T | undefined;

  setScope(scope: ScopeType): void;
}

export class Scope implements OnScope {
  protected scope?: ScopeType;

  public getValue<T = unknown>(key: string): T | undefined {
    return this.scope && this.scope.has(key)
      ? (this.scope.get(key) as T)
      : undefined;
  }

  public setScope(scope: ScopeType): void {
    this.scope = scope;
  }
}
