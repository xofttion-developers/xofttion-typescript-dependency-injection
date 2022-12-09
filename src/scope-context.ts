import { DependencyStore, InjectableStore, InstanceStore } from './stores';
import { Constructable, DependencyConfig, InjectableRef } from './types';

export class ScopeContext {
  private _injectableStore = new InjectableStore();

  private _instanceStore = new InstanceStore();

  private _dependencyStore = new DependencyStore();

  public addInjectable(injectable: InjectableRef): void {
    this._injectableStore.add(injectable);
  }

  public addDependency(config: DependencyConfig): void {
    this._dependencyStore.add(config);
  }

  public getInstance<T = unknown>(injectable: InjectableRef<T>): T {
    const scopeInstance = this._instanceStore.get(injectable);

    if (scopeInstance) {
      return scopeInstance as T;
    }

    if (!this._injectableStore.has(injectable)) {
      throw Error(`Class ${injectable.name} is not found in the Injectables catalog`);
    }

    const ScopeConstructor = injectable as unknown as Constructable<T>;
    const scopeDependencies = this._dependencyStore.get(injectable);

    const scopeParams: unknown[] =
      (Reflect as any)?.getMetadata('design:paramtypes', ScopeConstructor) || [];

    const paramsConstructor = scopeParams.map((param, index) => {
      if (scopeDependencies && scopeDependencies[index]) {
        return this.getInstance(scopeDependencies[index]);
      }

      return this.getInstance(param as CallableFunction);
    });

    const injectableInstance = new ScopeConstructor(...paramsConstructor);

    this._instanceStore.add(injectable, injectableInstance);

    return injectableInstance;
  }
}
