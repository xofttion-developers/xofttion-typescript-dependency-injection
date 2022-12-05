import { Constructable } from './types/constructable.type';
import { DependencyConfig, DependencyRef } from './types/dependency.type';

const SCOPE_CONTEXT_ROOT = 'root';

class Injectables {
  private _catalog: DependencyRef[] = [];

  public add(injectable: Function): void {
    if (!this.has(injectable)) {
      this._catalog.push(injectable);
    }
  }

  public has(injectable: Function): boolean {
    return this._catalog.includes(injectable);
  }
}

class Dependencies {
  private _map: Map<DependencyRef, DependencyRef[]> = new Map();

  public add(config: DependencyConfig): void {
    const { parent, index, dependency } = config;

    const dependencies = this.get(parent);

    dependencies[index] = dependency;
  }

  public get(parentKey: DependencyRef): DependencyRef[] {
    const dependenciesCurrent = this._map.get(parentKey);

    if (dependenciesCurrent) {
      return dependenciesCurrent;
    }

    const dependencies: DependencyRef[] = [];

    this._map.set(parentKey, dependencies);

    return dependencies;
  }
}

class Instances {
  private _map: Map<DependencyRef, unknown> = new Map();

  public add(dependency: DependencyRef, value: unknown): void {
    this._map.set(dependency, value);
  }

  public get(dependency: DependencyRef): any {
    return this._map.get(dependency);
  }
}

class ScopeContext {
  private _injectables = new Injectables();

  private _instances = new Instances();

  private _dependencies = new Dependencies();

  public addInjectable(injectable: DependencyRef): void {
    this._injectables.add(injectable);
  }

  public addDependency(config: DependencyConfig): void {
    this._dependencies.add(config);
  }

  public getInstance<T = unknown>(ref: DependencyRef<T>): T {
    const scopeInstance = this._instances.get(ref);

    if (scopeInstance) {
      return scopeInstance as T;
    }

    if (!this._injectables.has(ref)) {
      throw Error(`Class ${ref.name} is not found in the Injectables catalog`);
    }

    const scopeConstructor = ref as unknown as Constructable<T>;
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
}

const SCOPE_CONTEXTS = new Map<string, ScopeContext>();

export function createInjectable(
  injectable: DependencyRef,
  scopeKey?: string
): void {
  getScopeContext(scopeKey).addInjectable(injectable);
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
