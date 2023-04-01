import 'reflect-metadata';
import {
  DependencyStore,
  InjectableStore,
  locator,
  Scope,
  WorkSpace
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
  scope?: Scope;
  workspace?: WorkSpace;
};

type InjectProps<T> = {
  token: InjectableToken<T>;
  scope?: Scope;
  workspace?: WorkSpace;
};

type StoreProps<T> = {
  token: InjectableToken<T>;
  scope: Scope;
  workspace?: WorkSpace;
};

const KEY = 'design:paramtypes';

export class ContainerFactory {
  private readonly injectables: InjectableStore;

  private readonly scopes: Scope;

  private readonly dependencies: DependencyStore;

  constructor() {
    this.injectables = new InjectableStore();
    this.scopes = new Scope();
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
    const scope = new Scope();

    return singleton
      ? this.fetchSingleton<T>({ token, workspace, scope })
      : this.createObject<T>({ token, workspace, scope });
  }

  private createObject<T = unknown>(props: InjectProps<T>): T {
    const { token, workspace, scope } = props;

    const Class = token as unknown as Constructable<T>;

    const dependencies = this.dependencies.get(token);

    const tokens: InjectableToken[] = Reflect.getMetadata(KEY, Class);

    const params = tokens?.map((token, index) => {
      if (dependencies[index]) {
        return this.createFromDependencyConfig({
          token,
          scope,
          workspace,
          config: dependencies[index]
        });
      }

      const locatorToken = locator.get(token);

      if (locatorToken) {
        return scope
          ? this.fetchFromStore({ token: locatorToken, workspace, scope })
          : this.createObject({ token: locatorToken, workspace });
      }

      if (token === WorkSpace) {
        return workspace;
      }

      return this.createObject({ token, workspace, scope });
    });

    return new Class(...(params || []));
  }

  private fetchSingleton<T = unknown>({ token, workspace }: InjectProps<T>): T {
    return this.fetchFromStore({ token, workspace, scope: this.scopes });
  }

  private fetchFromStore<T = unknown>({
    token,
    scope,
    workspace
  }: StoreProps<T>): T {
    const singleton = scope.get<T>(token);

    if (singleton) {
      return singleton;
    }

    const object = this.createObject({ token, workspace, scope });

    scope.add(token, object);

    return object;
  }

  private createFromDependencyConfig<T = unknown>(
    props: DependencyProps<T>
  ): unknown {
    const {
      token,
      scope,
      workspace,
      config: { scopeable, singleton, target }
    } = props;

    const locatorToken = locator.get(target);

    if (locatorToken && singleton) {
      return this.fetchSingleton({ token: locatorToken, workspace });
    }

    if (locatorToken && scopeable && scope) {
      return this.fetchFromStore({
        token: locatorToken,
        scope,
        workspace
      });
    }

    return this.createObject({ token, workspace });
  }
}
