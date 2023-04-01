import 'reflect-metadata';
import {
  Context,
  DependencyStore,
  InjectableStore,
  locator,
  Scope
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
  context?: Context;
  scope?: Scope;
};

type InjectProps<T> = {
  token: InjectableToken<T>;
  context?: Context;
  scope?: Scope;
};

type StoreProps<T> = {
  token: InjectableToken<T>;
  context?: Context;
  scope: Scope;
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
    const { token: refInjectable, context } = config;
    const injectable = this.injectables.get(refInjectable);

    if (!injectable) {
      throw Error(
        `Class ${refInjectable.toString()} is not found in the collection`
      );
    }

    const { singleton, target: token } = injectable;
    const scope = new Scope();

    return singleton
      ? this.fetchSingleton<T>({ token, context, scope })
      : this.createObject<T>({ token, context, scope });
  }

  private createObject<T = unknown>(props: InjectProps<T>): T {
    const { token, context, scope } = props;

    const Class = token as unknown as Constructable<T>;

    const dependencies = this.dependencies.get(token);

    const tokens: InjectableToken[] = Reflect.getMetadata(KEY, Class);

    const params = tokens?.map((token, index) => {
      if (dependencies[index]) {
        return this.createFromDependencyConfig({
          token,
          scope,
          context,
          config: dependencies[index]
        });
      }

      const locatorToken = locator.get(token);

      if (locatorToken) {
        return scope
          ? this.fetchFromStore({ token: locatorToken, context, scope })
          : this.createObject({ token: locatorToken, context });
      }

      if (token === Context) {
        return context;
      }

      return this.createObject({ token, context, scope });
    });

    return new Class(...(params || []));
  }

  private fetchSingleton<T = unknown>({ token, context }: InjectProps<T>): T {
    return this.fetchFromStore({ token, context, scope: this.scopes });
  }

  private fetchFromStore<T = unknown>({ token, scope, context }: StoreProps<T>): T {
    const singleton = scope.get<T>(token);

    if (singleton) {
      return singleton;
    }

    const object = this.createObject({ token, context, scope });

    scope.add(token, object);

    return object;
  }

  private createFromDependencyConfig<T = unknown>(
    props: DependencyProps<T>
  ): unknown {
    const {
      context,
      token,
      scope,
      config: { scopeable, singleton, target }
    } = props;

    const locatorToken = locator.get(target);

    if (locatorToken && singleton) {
      return this.fetchSingleton({ token: locatorToken, context });
    }

    if (locatorToken && scopeable && scope) {
      return this.fetchFromStore({
        token: locatorToken,
        scope,
        context
      });
    }

    return this.createObject({ token, context });
  }
}
