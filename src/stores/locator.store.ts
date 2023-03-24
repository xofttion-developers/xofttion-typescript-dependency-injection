import { LocatorConfig, DependencyToken, InjectableToken } from '../types';

class LocatorStore {
  private dependencies: Map<DependencyToken, InjectableToken>;

  constructor() {
    this.dependencies = new Map();
  }

  public set(dependencies: LocatorConfig[]): void {
    dependencies.forEach(({ token, useClass }) => {
      this.dependencies.set(token, useClass);
    });
  }

  public get(token: DependencyToken): InjectableToken | undefined {
    return this.dependencies.get(token);
  }

  public add(
    reference: string | symbol | LocatorConfig,
    token?: InjectableToken
  ): void {
    if (typeof reference !== 'string' && typeof reference !== 'symbol') {
      const { token, useClass } = reference;

      this.dependencies.set(token, useClass);
    } else if (token) {
      this.dependencies.set(reference, token);
    }
  }
}

export const locator = new LocatorStore();
