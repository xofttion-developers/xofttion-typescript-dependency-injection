import { InjectableToken } from '../types';

export class Scope {
  private readonly collection: Map<InjectableToken, unknown>;

  constructor() {
    this.collection = new Map();
  }

  public add(token: InjectableToken, value: unknown): void {
    this.collection.set(token, value);
  }

  public get<T = unknown>(token: InjectableToken): T {
    return this.collection.get(token) as T;
  }
}
