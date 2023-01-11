import {
  InjectLocator,
  InjectableStore,
  InjectStore,
  InstanceStore
} from './stores';
import {
  Constructable,
  InjectableConfig,
  InjectableRef,
  InjectConfig,
  InjectRef
} from './types';

export class ScopeContainer {
  private _injectables = new InjectableStore();

  private _injects = new InjectStore();

  private _instances = new InstanceStore();

  public addInjectable(config: InjectableConfig): void {
    this._injectables.add(config);
  }

  public addInject(config: InjectConfig): void {
    this._injects.add(config);
  }

  public createInjectable<T = unknown>(ref: InjectableRef<T>): T {
    const refConfig = this._injectables.get(ref);

    if (!refConfig) {
      throw Error(`Class ${ref.name} is not found in the Injectables`);
    }

    const { singleton, target } = refConfig;

    return singleton ? this._getSingleton<T>(target) : this._createObject<T>(target);
  }

  private _createObject<T = unknown>(ref: InjectableRef<T>): T {
    const ConstructorObject = ref as unknown as Constructable<T>;

    const injectsRef = this._injects.get(ref);

    const paramsRef: unknown[] = (Reflect as any)?.getMetadata(
      'design:paramtypes',
      ConstructorObject
    );

    const params = paramsRef?.map((paramRef, index) => {
      const injectConfig = injectsRef[index];

      if (!injectConfig) {
        return this._createObject(paramRef as InjectableRef);
      }

      const { singleton, target } = injectConfig;

      const injectRef = this._getInjectableRef(target);

      if (!injectRef) {
        return this._createObject(paramRef as InjectableRef);
      }

      return singleton
        ? this._getSingleton(injectRef)
        : this._createObject(injectRef);
    });

    return new ConstructorObject(...(params || []));
  }

  private _getSingleton<T = unknown>(ref: InjectableRef<T>): T {
    let instanceObject = this._instances.get(ref);

    if (!instanceObject) {
      instanceObject = this._createObject(ref);

      this._instances.add(ref, instanceObject);
    }

    return instanceObject as T;
  }

  private _getInjectableRef(ref: InjectRef): InjectableRef | undefined {
    return typeof ref === 'string' ? InjectLocator.get(ref) : (ref as InjectableRef);
  }
}
