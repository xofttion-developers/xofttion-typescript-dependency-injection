import { DependencyLocatorConfig, DependencyToken, InjectableToken } from '../types';

class DependencyLocatorStore {
  private dependencies: Map<DependencyToken, InjectableToken> = new Map();

  public set(dependencies: DependencyLocatorConfig[]): void {
    dependencies.forEach(({ token, useClass }) => {
      this.dependencies.set(token, useClass);
    });
  }

  public get(key: string | symbol): InjectableToken | undefined {
    return this.dependencies.get(key);
  }

  public add(
    locator: string | symbol | DependencyLocatorConfig,
    token?: InjectableToken
  ): void {
    if (typeof locator !== 'string' && typeof locator !== 'symbol') {
      const { token, useClass } = locator;

      this.dependencies.set(token, useClass);
    } else if (token) {
      this.dependencies.set(locator, token);
    }
  }
}

export const DependencyLocator = new DependencyLocatorStore();
