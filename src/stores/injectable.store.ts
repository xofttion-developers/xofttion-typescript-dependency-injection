import { InjectableRef } from '../types';

export class InjectableStore {
  private _catalog: InjectableRef[] = [];

  public add(injectable: Function): void {
    if (!this.has(injectable)) {
      this._catalog.push(injectable);
    }
  }

  public has(injectable: Function): boolean {
    return this._catalog.includes(injectable);
  }
}
