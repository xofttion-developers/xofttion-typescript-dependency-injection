import { InjectableRef } from '../types';

export class InstanceStore {
  private collection: Map<InjectableRef, unknown> = new Map();

  public add(dependency: InjectableRef, value: unknown): void {
    this.collection.set(dependency, value);
  }

  public get(dependency: InjectableRef): any {
    return this.collection.get(dependency);
  }
}
