import { InjectableRef } from '../types';

class DependencyStore {
  private _dependencies: Map<string, InjectableRef> = new Map();

  public add(key: string, ref: InjectableRef): void {
    this._dependencies.set(key, ref);
  }

  public get(key: string): InjectableRef | undefined {
    return this._dependencies.get(key);
  }
}

export const Dependencies = new DependencyStore();
