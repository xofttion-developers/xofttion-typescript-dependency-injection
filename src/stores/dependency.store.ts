import { DependencyConfig, DependencyJson, InjectableRef } from '../types';

class DependencyMapStore {
  private _dependencies: Map<string, InjectableRef> = new Map();

  public set(dependencies: DependencyJson[]): void {
    dependencies.forEach(({ name, use }) => {
      this._dependencies.set(name, use);
    });
  }

  public get(key: string): InjectableRef | undefined {
    return this._dependencies.get(key);
  }

  public add(dependency: string | DependencyJson, ref?: InjectableRef): void {
    if (typeof dependency !== 'string') {
      const { name, use } = dependency as DependencyJson;

      this._dependencies.set(name, use);
    } else if (ref) {
      this._dependencies.set(dependency, ref);
    }
  }
}

export const DependenciesMap = new DependencyMapStore();

type DependencyMap = Map<Function, DependencyConfig[]>;

export class DependencyStore {
  private _collection: DependencyMap = new Map();

  public add(injectable: Function, config: DependencyConfig): void {
    const dependencies = this.get(injectable);

    dependencies.push(config);
  }

  public get(injectable: Function): DependencyConfig[] {
    const currentDependencies = this._collection.get(injectable);

    if (currentDependencies) {
      return currentDependencies;
    }

    const dependencies: DependencyConfig[] = [];

    this._collection.set(injectable, dependencies);

    return dependencies;
  }
}
