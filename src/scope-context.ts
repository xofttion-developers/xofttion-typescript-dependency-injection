import { Dependencies, InjectableStore, InjectStore, InstanceStore } from './stores';
import { Constructable, InjectableRef, InjectConfig, InjectType } from './types';

export class ScopeContext {
  private _injectables = new InjectableStore();

  private _injects = new InjectStore();

  private _instances = new InstanceStore();

  public addInjectable(injectable: InjectableRef): void {
    this._injectables.add(injectable);
  }

  public addInject(config: InjectConfig): void {
    this._injects.add(config);
  }

  public getInstance<T = unknown>(injectable: InjectableRef<T>): T {
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
        const injectableRef = this.getDependency(injectsScope[index]);

        if (injectableRef) {
          return this.getInstance(injectableRef);
        }
      }

      return this.getInstance(param as CallableFunction);
    });

    const injectableScope = new ConstructorScope(...params);

    this._instances.add(injectable, injectableScope);

    return injectableScope;
  }

  private getDependency(inject: InjectType): InjectableRef | undefined {
    return typeof inject === 'string'
      ? Dependencies.get(inject)
      : (inject as InjectableRef);
  }
}
