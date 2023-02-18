export class ScopeStore extends Map<string, unknown> {
  public getValue<T = unknown>(key: string): T | undefined {
    return this.has(key) ? (this.get(key) as T) : undefined;
  }
}
