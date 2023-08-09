import { InjectableToken } from '../types';

export class ScopeStore {
  private readonly collection: Map<InjectableToken, unknown>;

  constructor() {
    this.collection = new Map();
  }

  public push(token: InjectableToken, value: unknown): void {
    this.collection.set(token, value);
  }

  public fetch<T = unknown>(token: InjectableToken): T {
    if (!this.collection.has(token)) {
      throw Error(`Class ${token.toString()} is not found in the scope`);
    }

    return this.collection.get(token) as T;
  }
}
