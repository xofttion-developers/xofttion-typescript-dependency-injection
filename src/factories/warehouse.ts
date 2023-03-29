import 'reflect-metadata';
import {
  DependencyStore,
  InjectableStore,
  locator,
  ScopeStore,
  WorkspaceStore
} from '../stores';
import {
  Constructable,
  DependencyConfig,
  InjectableConfig,
  InjectableToken,
  InjectionConfig
} from '../types';

type DependencyProps<T> = {
  config: DependencyConfig;
  token: InjectableToken<T>;
  store?: ScopeStore;
  workspace?: WorkspaceStore;
};

type InjectProps<T> = {
  token: InjectableToken<T>;
  store?: ScopeStore;
  workspace?: WorkspaceStore;
};

type StoreProps<T> = {
  token: InjectableToken<T>;
  store: ScopeStore;
  workspace?: WorkspaceStore;
};

const KEY = 'design:paramtypes';

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
    const { token: refInjectable, workspace } = config;
    const injectable = this.injectables.get(refInjectable);

    if (!injectable) {
      throw Error(
        `Class ${refInjectable.toString()} is not found in the collection`
      );
    }

    const { singleton, target: token } = injectable;
    const store = new ScopeStore();

    return singleton
      ? this.fetchSingleton<T>({ token, workspace, store })
      : this.createObject<T>({ token, workspace, store });
  }

  private createObject<T = unknown>(props: InjectProps<T>): T {
    const { token, workspace, store } = props;

    const Class = token as unknown as Constructable<T>;

    const dependencies = this.dependencies.get(token);

    const tokens: InjectableToken[] = Reflect.getMetadata(KEY, Class);

    const params = tokens?.map((token, index) => {
      if (dependencies[index]) {
        return this.createFromDependencyConfig({
          token,
          workspace,
          store,
          config: dependencies[index]
        });
      }

      const locatorToken = locator.get(token);

      if (locatorToken) {
        return store
          ? this.fetchFromStore({ token: locatorToken, workspace, store })
          : this.createObject({ token: locatorToken, workspace });
      }

      if (token === WorkspaceStore) {
        return workspace;
      }

      return this.createObject({ token, workspace, store });
    });

    return new Class(...(params || []));
  }

  private fetchSingleton<T = unknown>({ token, workspace }: InjectProps<T>): T {
    return this.fetchFromStore({ token, workspace, store: this.scopes });
  }

  private fetchFromStore<T = unknown>({
    token,
    workspace,
    store
  }: StoreProps<T>): T {
    const singleton = store.get<T>(token);

    if (singleton) {
      return singleton;
    }

    const object = this.createObject({ token, workspace, store });

    store.add(token, object);

    return object;
  }

  private createFromDependencyConfig<T = unknown>(
    props: DependencyProps<T>
  ): unknown {
    const {
      token,
      store,
      workspace,
      config: { scopeable, singleton, target }
    } = props;

    const locatorToken = locator.get(target);

    if (locatorToken && singleton) {
      return this.fetchSingleton({ token: locatorToken, workspace });
    }

    if (locatorToken && scopeable && store) {
      return this.fetchFromStore({
        token: locatorToken,
        workspace,
        store
      });
    }

    return this.createObject({ token, workspace });
  }
}
