import {
  DependenciesMap,
  DependencyStore,
  InjectableStore,
  InjectStore,
  InstanceStore
} from './stores';
import {
  Constructable,
  DependencyConfig,
  InjectableRef,
  InjectConfig,
  InjectType
} from './types';

type FunctionKey = { [key: string | symbol]: Function };

export class ScopeContext {
  private _injectables = new InjectableStore();

  private _injects = new InjectStore();

  private _instances = new InstanceStore();

  private _dependencies = new DependencyStore();

  public addInjectable(injectable: InjectableRef): void {
    this._injectables.add(injectable);
  }

  public addInject(config: InjectConfig): void {
    this._injects.add(config);
  }

  public addDependency(injectable: InjectableRef, config: DependencyConfig): void {
    this._dependencies.add(injectable, config);
  }

  public createInjectable<T = unknown>(injectable: InjectableRef<T>): T {
    const instance = this._getInstance(injectable);

    const dependencies = this._dependencies.get(injectable);

    for (const { target, functionKey } of dependencies) {
      const value = this._getDependency(target);

      const resolver = (instance as FunctionKey)[functionKey].bind(instance);

      resolver(value);
    }

    return instance;
  }

  private _getInstance<T = unknown>(injectable: InjectableRef<T>): T {
    const instanceScope = this._instances.get(injectable);

    if (instanceScope) {
      return instanceScope as T;
    }

    if (!this._injectables.has(injectable)) {
      throw Error(`Class ${injectable} is not found in the Injectables catalog`);
    }

    const ConstructorScope = injectable as unknown as Constructable<T>;
    const injectsScope = this._injects.get(injectable);

    const paramsScope: unknown[] =
      (Reflect as any)?.getMetadata('design:paramtypes', ConstructorScope) || [];

    const params = paramsScope.map((param, index) => {
      if (injectsScope[index]) {
        const injectRef = this._getInject(injectsScope[index]);

        if (injectRef) {
          return this.createInjectable(injectRef);
        }
      }

      return this.createInjectable(param as CallableFunction);
    });

    const injectableScope = new ConstructorScope(...params);

    this._instances.add(injectable, injectableScope);

    return injectableScope;
  }

  private _getDependency<T = unknown>(dependency: InjectType<T>): T {
    const inject = this._getInject(dependency);

    if (!inject) {
      throw Error(`Class ${dependency} is not found in the Injectables catalog`);
    }

    const ConstructorScope = inject as unknown as Constructable<T>;
    const injectsScope = this._injects.get(inject);

    const paramsScope: unknown[] =
      (Reflect as any)?.getMetadata('design:paramtypes', ConstructorScope) || [];

    const params = paramsScope.map((param, index) => {
      if (injectsScope[index]) {
        const injectRef = this._getInject(injectsScope[index]);

        if (injectRef) {
          return this._getDependency(injectRef);
        }
      }

      return this._getDependency(param as CallableFunction);
    });

    return new ConstructorScope(...params);
  }

  private _getInject(inject: InjectType): InjectableRef | undefined {
    return typeof inject === 'string'
      ? DependenciesMap.get(inject)
      : (inject as InjectableRef);
  }
}
