import 'reflect-metadata';
import {
  Context,
  InjectStore,
  InjectableStore,
  Scope,
  fetchInLocator
} from '../stores';
import {
  Constructable,
  InjectConfig,
  InjectableConfig,
  InjectableToken,
  InjectionConfig
} from '../types';

type InjectProps<T> = {
  config: InjectConfig;
  token: InjectableToken<T>;
  context?: Context;
  scope?: Scope;
};

type InjectableProps<T> = {
  token: InjectableToken<T>;
  context?: Context;
  scope?: Scope;
};

type StoreProps<T> = {
  token: InjectableToken<T>;
  scope: Scope;
  context?: Context;
};

const key = 'design:paramtypes';

export class Container {
  private readonly injectables: InjectableStore;

  private readonly scopes: Scope;

  private readonly injects: InjectStore;

  constructor() {
    this.injectables = new InjectableStore();
    this.scopes = new Scope();
    this.injects = new InjectStore();
  }

  public registerInjectable(config: InjectableConfig): void {
    this.injectables.push(config);
  }

  public registerInject(config: InjectConfig): void {
    this.injects.push(config);
  }

  public printInjectables(): void {
    console.log(this.injectables);
  }

  public printInjects(): void {
    console.log(this.injects);
  }

  public createInjectable<T = unknown>(config: InjectionConfig<T>): T {
    const { token: refInjectable, context } = config;
    const injectable = this.injectables.fetch(refInjectable);

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

  private createObject<T = unknown>(props: InjectableProps<T>): T {
    const Class = props.token as unknown as Constructable<T>;

    const tokens: InjectableToken[] = Reflect.getMetadata(key, Class);

    const params = tokens
      ? this.createReflectArguments(tokens, props)
      : this.createInjectArguments(props);

    return new Class(...params);
  }

  private createReflectArguments<T>(
    tokens: InjectableToken[],
    props: InjectableProps<T>
  ): unknown[] {
    const { token, context, scope } = props;

    const dependencies = this.injects.fetch(token);

    return tokens.map((token, index) => {
      if (dependencies[index]) {
        return this.createFromDependencyConfig({
          token,
          scope,
          context,
          config: dependencies[index]
        });
      }

      const locatorToken = fetchInLocator(token);

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
  }

  private createInjectArguments<T>(props: InjectableProps<T>): unknown[] {
    const { token, context, scope } = props;

    const dependencies = this.injects.fetch(token);

    return dependencies.reduce((injects, { target }, index) => {
      injects[index] = this.createObject({
        token: target,
        scope,
        context
      });

      return injects;
    }, [] as unknown[]);
  }

  private fetchSingleton<T = unknown>({ token, context }: InjectableProps<T>): T {
    return this.fetchFromStore({ token, context, scope: this.scopes });
  }

  private fetchFromStore<T = unknown>({ token, scope, context }: StoreProps<T>): T {
    const singleton = scope.fetch<T>(token);

    if (singleton) {
      return singleton;
    }

    const object = this.createObject({ token, context, scope });

    scope.push(token, object);

    return object;
  }

  private createFromDependencyConfig<T = unknown>(props: InjectProps<T>): unknown {
    const {
      context,
      scope,
      config: { scopeable, singleton, target }
    } = props;

    const locatorToken = fetchInLocator(target);

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

    return this.createObject({ token: target, context });
  }
}
