import { InjectConfig, InjectableToken } from '../types';

export class InjectStore {
  private collection: Map<InjectableToken, InjectConfig[]> = new Map();

  public add(config: InjectConfig): void {
    const { parent, index } = config;

    const injects = this.get(parent);

    injects[index] = config;
  }

  public get(token: InjectableToken): InjectConfig[] {
    const current = this.collection.get(token);

    if (current) {
      return current;
    }

    const injects: InjectConfig[] = [];

    this.collection.set(token, injects);

    return injects;
  }
}
