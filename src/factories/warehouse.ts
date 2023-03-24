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

type Props<T> = {
  token: InjectableToken<T>;
  workspace?: WorkspaceStore;
  store?: ScopeStore;
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
    const { token, workspace } = config;
    const injConfig = this.injectables.get(token);

    if (!injConfig) {
      throw Error(`Class ${token.toString()} is not found in the collection`);
    }

    const { singleton, target } = injConfig;
    const store = new ScopeStore();

    return singleton
      ? this.getSingleton<T>({ token: target, workspace, store })
      : this.createObject<T>({ token: target, workspace, store });
  }

  private createObject<T = unknown>({ token, workspace, store }: Props<T>): T {
    const ConstructorObj = token as unknown as Constructable<T>;

    const configs = this.dependencies.get(token);

    const tokens: InjectableToken[] = Reflect.getMetadata(KEY, ConstructorObj);

    const params = tokens?.map((depToken, index) => {
      const depInjToken = locator.get(depToken);

      if (depInjToken) {
        return this.createObject({ token: depInjToken, workspace });
      }

      if (!configs[index]) {
        return this.createObject({ token: depToken, workspace });
      }

      const { singleton, factory, target } = configs[index];

      if (target === undefined) {
        return workspace;
      }

      const injToken = locator.get(target);

      if (!injToken) {
        return this.createObject({ token: depToken, workspace });
      }

      if (singleton) {
        return this.getSingleton({ token: injToken, workspace, store });
      }

      if (factory && store) {
        const depObject = store.get(injToken);

        if (depObject) {
          return depObject;
        }

        const depValue = this.createObject({
          token: injToken,
          workspace,
          store
        });

        store.add(injToken, depValue);

        return depValue;
      }

      return this.createObject({ token: injToken, workspace, store });
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
}
