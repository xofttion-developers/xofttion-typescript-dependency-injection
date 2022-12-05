import { Constructable } from './types/constructable.type';
import { DependencyRef } from './types/dependency.type';

const SCOPE_CONTEXT_ROOT = 'root';

type DependencyConfig = {
  dependencyKey?: string;
  index: number;
  parentKey: string;
};

class Injectables {
  private _map: Map<string, Function> = new Map();

  public add(key: string, injectable: Function): void {
    if (!this.has(key)) {
      this._map.set(key, injectable);
    }
  }

  public get(key: string): Function | undefined {
    return this._map.get(key);
  }

  public has(key: string): boolean {
    return this._map.has(key);
  }
}

class Dependencies {
  private _map: Map<string, string[]> = new Map();

  public add(config: DependencyConfig): void {
    const { parentKey, index, dependencyKey } = config;

    if (dependencyKey) {
      const dependencies = this.get(parentKey);

      dependencies[index] = dependencyKey;
    }
  }

  public get(parentKey: string): string[] {
    const dependenciesCurrent = this._map.get(parentKey);

    if (dependenciesCurrent) {
      return dependenciesCurrent;
    }

    const dependencies: string[] = [];

    this._map.set(parentKey, dependencies);

    return dependencies;
  }
}

class Instances {
  private _map: Map<string, unknown> = new Map();

  public add(injectableKey: string, value: unknown): void {
    this._map.set(injectableKey, value);
  }

  public get(injectableKey: string): any {
    return this._map.get(injectableKey);
  }
}

class ScopeContext {
  private _injectables = new Injectables();

  private _instances = new Instances();

  private _dependencies = new Dependencies();

  public addInjectable(key: string, injectable: Function): void {
    this._injectables.add(key, injectable);
  }

  public addDependency(config: DependencyConfig): void {
    this._dependencies.add(config);
  }

  public getInstance<T = unknown>(dependencyRef: DependencyRef<T>): T {
    const ref = this._getDependencyRefKey(dependencyRef);

    const scopeInstance = this._instances.get(ref);

    if (scopeInstance) {
      return scopeInstance as T;
    }

    const scopeInjectable = this._injectables.get(ref);

    if (!scopeInjectable) {
      throw Error(`Class ${ref} is not found in the Injectables catalog`);
    }

    const scopeConstructor = scopeInjectable as unknown as Constructable<T>;
    const scopeDependencies = this._dependencies.get(ref);

    const scopeParams: unknown[] =
      (Reflect as any)?.getMetadata('design:paramtypes', scopeConstructor) || [];

    const paramsConstructor = scopeParams.map((param, index) => {
      if (scopeDependencies && scopeDependencies[index]) {
        return this.getInstance(scopeDependencies[index]);
      }

      return this.getInstance(param as CallableFunction);
    });

    const injectableInstance = new scopeConstructor(...paramsConstructor);

    this._instances.add(ref, injectableInstance);

    return injectableInstance;
  }

  private _getDependencyRefKey<T>(ref: DependencyRef<T>): string {
    return typeof ref === 'string' ? ref : ref.name;
  }
}

const SCOPE_CONTEXTS = new Map<string, ScopeContext>();

export function createInjectable(
  key: string,
  injectable: Function,
  scopeKey?: string
): void {
  getScopeContext(scopeKey).addInjectable(key, injectable);
}

export function createDependency(
  dependency: DependencyConfig,
  scopeKey?: string
): void {
  getScopeContext(scopeKey).addDependency(dependency);
}

export function InjectableFactory<T = unknown>(
  ref: DependencyRef<T>,
  scopeKey?: string
): T {
  return getScopeContext(scopeKey).getInstance(ref);
}

function getScopeContext(scopeKey?: string): ScopeContext {
  const scopeFinal = scopeKey || SCOPE_CONTEXT_ROOT;

  const contextCurrent = SCOPE_CONTEXTS.get(scopeFinal);

  if (contextCurrent) {
    return contextCurrent;
  }

  const scopeContext = new ScopeContext();

  SCOPE_CONTEXTS.set(scopeFinal, scopeContext);

  return scopeContext;
}
