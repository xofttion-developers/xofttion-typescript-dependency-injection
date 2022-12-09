import { DependencyConfig, InjectableRef } from '../types';

export class DependencyStore {
  private _map: Map<InjectableRef, InjectableRef[]> = new Map();

  public add(config: DependencyConfig): void {
    const { parent, index, dependency } = config;

    const dependencies = this.get(parent);

    dependencies[index] = dependency;
  }

  public get(parentKey: InjectableRef): InjectableRef[] {
    const dependenciesCurrent = this._map.get(parentKey);

    if (dependenciesCurrent) {
      return dependenciesCurrent;
    }

    const dependencies: InjectableRef[] = [];

    this._map.set(parentKey, dependencies);

    return dependencies;
  }
}
