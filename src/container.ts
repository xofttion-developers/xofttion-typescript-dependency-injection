import {
  InjectLocator,
  InjectableStore,
  InjectStore,
  DependencyStore
} from './stores';
import {
  Constructable,
  InjectableConfig,
  InjectableRef,
  InjectConfig,
  InjectionConfig,
  InjectRef,
  ScopeStore
} from './types';
import 'reflect-metadata';

type ContainerProps<T> = {
  ref: InjectableRef<T>;
  scope?: ScopeStore;
  store?: DependencyStore;
};

const metaKey = 'design:paramtypes';

class Container {
  private injectables = new InjectableStore();

  private injects = new InjectStore();

  private dependencies = new DependencyStore();

  public pushInjectable(config: InjectableConfig): void {
    this.injectables.add(config);
  }

  public pushInject(config: InjectConfig): void {
    this.injects.add(config);
  }

  public createInjectable<T = unknown>(config: InjectionConfig<T>): T {
    const { ref, scope } = config;
    const refConfig = this.injectables.get(ref);

    if (!refConfig) {
      throw Error(`Class ${ref.name} is not found in the collection`);
    }

    const { singleton, target } = refConfig;
    const store = new DependencyStore();

    return singleton
      ? this.getSingleton<T>({ ref: target, scope, store })
      : this.createObject<T>({ ref: target, scope, store });
  }

  private createObject<T = unknown>({ ref, scope, store }: ContainerProps<T>): T {
    const ConstructorObj = ref as unknown as Constructable<T>;

    const configs = this.injects.get(ref);

    const refs: InjectableRef[] = Reflect.getMetadata(metaKey, ConstructorObj);

    const params = refs?.map((refParam, index) => {
      if (!configs[index]) {
        return this.createObject({ ref: refParam, scope });
      }

      const { singleton, container, target, key } = configs[index];

      if (key === 'scope') {
        return scope;
      }

      const refInject = this.getInjectableRef(target);

      if (!refInject) {
        return this.createObject({ ref: refParam, scope });
      }

      if (singleton) {
        return this.getSingleton({ ref: refInject, scope, store });
      }

      if (container && store) {
        const refObject = store.get(refInject);

        if (refObject) {
          return refObject;
        }

        const refValue = this.createObject({ ref: refInject, scope, store });

        store.add(refInject, refValue);

        return refValue;
      }

      return this.createObject({ ref: refInject, scope, store });
    });

    return new ConstructorObj([...(params || [])]);
  }

  private getSingleton<T = unknown>({ ref, store }: ContainerProps<T>): T {
    const refObject = this.dependencies.get<T>(ref);

    if (refObject) {
      return refObject;
    }

    const refValue = this.createObject({ ref, store });

    this.dependencies.add(ref, refValue);

    return refValue;
  }

  private getInjectableRef(ref: InjectRef): InjectableRef | undefined {
    return typeof ref === 'string' ? InjectLocator.get(ref) : ref;
  }
}

const rootContainer = new Container();

export default rootContainer;
