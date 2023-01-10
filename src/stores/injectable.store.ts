import { InjectableConfig, InjectableRef } from '../types';

export class InjectableStore {
  private _collection: Map<InjectableRef, InjectableConfig> = new Map();

  public add(config: InjectableConfig): void {
    this._collection.set(config.target, config);
  }

  public get(injectable: InjectableRef): InjectableConfig | undefined {
    return this._collection.get(injectable);
  }
}
