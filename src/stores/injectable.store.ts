import { InjectableConfig, InjectableToken } from '../types';

export class InjectableStore {
  private collection: Map<InjectableToken, InjectableConfig> = new Map();

  public push(config: InjectableConfig): void {
    this.collection.set(config.target, config);
  }

  public fetch(token: InjectableToken): Undefined<InjectableConfig> {
    return this.collection.get(token);
  }
}
