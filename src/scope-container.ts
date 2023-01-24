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
  private injectables = new InjectableStore();

  private injects = new InjectStore();

  private instances = new InstanceStore();

  public addInjectable(config: InjectableConfig): void {
    this.injectables.add(config);
  }

  public addInject(config: InjectConfig): void {
    this.injects.add(config);
  }

  public createInjectable<T = unknown>(ref: InjectableRef<T>): T {
    const refConfig = this.injectables.get(ref);

    if (!refConfig) {
      throw Error(`Class ${ref.name} is not found in the Injectables`);
    }

    const { singleton, target } = refConfig;

    return singleton ? this.getSingleton<T>(target) : this.createObject<T>(target);
  }

  private createObject<T = unknown>(ref: InjectableRef<T>): T {
    const ConstructorObject = ref as unknown as Constructable<T>;

    const injectConfigs = this.injects.get(ref);

    const paramsRef: unknown[] = (Reflect as any)?.getMetadata(
      'design:paramtypes',
      ConstructorObject
    );

    const params = paramsRef?.map((paramRef, index) => {
      const config = injectConfigs[index];

      if (!config) {
        return this.createObject(paramRef as InjectableRef);
      }

      const { singleton, target } = config;

      const injectRef = this.getInjectableRef(target);

      if (!injectRef) {
        return this.createObject(paramRef as InjectableRef);
      }

      return singleton
        ? this.getSingleton(injectRef)
        : this.createObject(injectRef);
    });

    return new ConstructorObject(...(params || []));
  }

  private getSingleton<T = unknown>(ref: InjectableRef<T>): T {
    let instance = this.instances.get(ref);

    if (!instance) {
      instance = this.createObject(ref);

      this.instances.add(ref, instance);
    }

    return instance as T;
  }

  private getInjectableRef(ref: InjectRef): InjectableRef | undefined {
    return typeof ref === 'string' ? InjectLocator.get(ref) : (ref as InjectableRef);
  }
}
