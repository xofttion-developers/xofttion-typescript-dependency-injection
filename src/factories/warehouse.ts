import 'reflect-metadata';
import {
  DependencyLocator,
  DependencyStore,
  InjectableStore,
  NamespaceStore,
  ScopeStore
} from '../stores';
import {
  Constructable,
  DependencyConfig,
  DependencyKey,
  InjectableConfig,
  InjectableToken,
  InjectionConfig
} from '../types';

type Props<T> = {
  token: InjectableToken<T>;
  namespace?: NamespaceStore;
  store?: ScopeStore;
};

const metaKey = 'design:paramtypes';

export class WarehouseContainer {
  private readonly injectables: InjectableStore;

  private readonly scopes: ScopeStore;

  private readonly dependencies: DependencyStore;

  constructor() {
    this.injectables = new InjectableStore();
    this.scopes = new ScopeStore();
    this.dependencies = new DependencyStore();
  }

  public pushInjectable(config: InjectableConfig): void {
    this.injectables.add(config);
  }

  public pushDependency(config: DependencyConfig): void {
    this.dependencies.add(config);
  }

  public createInjectable<T = unknown>(config: InjectionConfig<T>): T {
    const { token, namespace } = config;
    const injConfig = this.injectables.get(token);

    if (!injConfig) {
      throw Error(`Class ${token.toString()} is not found in the collection`);
    }

    const { singleton, target } = injConfig;
    const store = new ScopeStore();

    return singleton
      ? this.getSingleton<T>({ token: target, namespace, store })
      : this.createObject<T>({ token: target, namespace, store });
  }

  private createObject<T = unknown>({ token, namespace, store }: Props<T>): T {
    const ConstructorObj = token as unknown as Constructable<T>;

    const configs = this.dependencies.get(token);

    const tokens: InjectableToken[] = Reflect.getMetadata(metaKey, ConstructorObj);

    const params = tokens?.map((depToken, index) => {
      if (!configs[index]) {
        return this.createObject({ token: depToken, namespace });
      }

      const { singleton, factory, target } = configs[index];

      if (target === undefined) {
        return namespace;
      }

      const injToken = this.getInjectableToken(target);

      if (!injToken) {
        return this.createObject({ token: depToken, namespace });
      }

      if (singleton) {
        return this.getSingleton({ token: injToken, namespace, store });
      }

      if (factory && store) {
        const depObject = store.get(injToken);

        if (depObject) {
          return depObject;
        }

        const depValue = this.createObject({ token: injToken, namespace, store });

        store.add(injToken, depValue);

        return depValue;
      }

      return this.createObject({ token: injToken, namespace, store });
    });

    return new ConstructorObj(...(params || []));
  }

  private getSingleton<T = unknown>({ token, store }: Props<T>): T {
    const scpObject = this.scopes.get<T>(token);

    if (scpObject) {
      return scpObject;
    }

    const scpValue = this.createObject({ token, store });

    this.scopes.add(token, scpValue);

    return scpValue;
  }

  private getInjectableToken(key: DependencyKey): InjectableToken | undefined {
    return typeof key === 'string' || typeof key === 'symbol'
      ? DependencyLocator.get(key)
      : key;
  }
}
