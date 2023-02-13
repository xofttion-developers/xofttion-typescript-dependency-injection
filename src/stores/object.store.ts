import { InjectableRef } from '../types';

export class ObjectStore {
  private collection: Map<InjectableRef, unknown> = new Map();

  public add(dependency: InjectableRef, value: unknown): void {
    this.collection.set(dependency, value);
  }

  public get<T = unknown>(dependency: InjectableRef): T {
    return this.collection.get(dependency) as T;
  }
}
