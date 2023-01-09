import { InjectConfig, InjectableRef, InjectType } from '../types';

export class InjectStore {
  private _map: Map<InjectableRef, InjectType[]> = new Map();

  public add(config: InjectConfig): void {
    const { parent, index, target } = config;

    const injects = this.get(parent);

    injects[index] = target;
  }

  public get(parentRef: InjectableRef): InjectType[] {
    const currentInjects = this._map.get(parentRef);

    if (currentInjects) {
      return currentInjects;
    }

    const injects: InjectType[] = [];

    this._map.set(parentRef, injects);

    return injects;
  }
}
