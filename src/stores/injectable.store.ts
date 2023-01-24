import { InjectableConfig, InjectableRef } from '../types';

export class InjectableStore {
  private collection: Map<InjectableRef, InjectableConfig> = new Map();

  public add(config: InjectableConfig): void {
    this.collection.set(config.target, config);
  }

  public get(injectable: InjectableRef): InjectableConfig | undefined {
    return this.collection.get(injectable);
  }
}
