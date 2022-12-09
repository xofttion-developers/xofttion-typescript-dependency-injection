import { InjectableRef } from '../types';

export class InstanceStore {
  private _map: Map<InjectableRef, unknown> = new Map();

  public add(dependency: InjectableRef, value: unknown): void {
    this._map.set(dependency, value);
  }

  public get(dependency: InjectableRef): any {
    return this._map.get(dependency);
  }
}
