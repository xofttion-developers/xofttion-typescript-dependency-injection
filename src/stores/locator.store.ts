import { LocatorConfig, InjectToken, InjectableToken } from '../types';

type Reference = string | symbol | LocatorConfig;

class LocatorStore {
  private collection: Map<InjectToken, LocatorConfig>;

  constructor() {
    this.collection = new Map();
  }

  public save(dependencies: LocatorConfig[]): void {
    dependencies.forEach((config) => {
      this.collection.set(config.token, config);
    });
  }

  public push(reference: Reference, token?: InjectableToken): void {
    if (typeof reference !== 'string' && typeof reference !== 'symbol') {
      const { token, useClass } = reference;

      this.collection.set(token, { token, useClass });
    } else if (token) {
      this.collection.set(reference, { token, useClass: token });
    }
  }

  public fetch(token: InjectToken): Undefined<LocatorConfig> {
    return this.collection.get(token);
  }
}

const locator = new LocatorStore();

export function saveInLocator(dependencies: LocatorConfig[]): void {
  locator.save(dependencies);
}

export function pushInLocator(reference: Reference, token?: InjectableToken): void {
  locator.push(reference, token);
}

export function fetchInLocator(token: InjectToken): Undefined<LocatorConfig> {
  return locator.fetch(token);
}
